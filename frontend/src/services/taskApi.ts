import { Priority, Task } from '../types/task.types';
import { v4 as uuidv4 } from 'uuid';

export type TaskFilters = {
  priority?: Priority;
  completed?: boolean;
};

const STORAGE_KEY = 'tasks';

function getStoredTasks(): Task[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveStoredTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export async function fetchTasks(filters?: TaskFilters): Promise<Task[]> {
  let tasks = getStoredTasks();
  if (filters) {
    if (filters.priority) {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }
    if (typeof filters.completed === 'boolean') {
      tasks = tasks.filter(t => t.completed === filters.completed);
    }
  }
  return tasks;
}

export async function createTask(payload: { title: string; description?: string; priority: Priority }): Promise<Task> {
  const tasks = getStoredTasks();
  const newTask: Task = {
    id: uuidv4(),
    title: payload.title,
    description: payload.description,
    priority: payload.priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  saveStoredTasks([newTask, ...tasks]);
  return newTask;
}

export async function updateTask(
    id: string,
    updates: Partial<{ title: string; priority: Priority; completed: boolean }>
): Promise<Task> {
  const tasks = getStoredTasks();
  const updatedTasks = tasks.map(task => {
    if (task.id === id) {
      const updated = { ...task, ...updates };
      if ('completed' in updates) {
        updated.completedAt = updates.completed ? new Date().toISOString() : undefined;
      }
      return updated;
    }
    return task;
  });
  saveStoredTasks(updatedTasks);
  const updatedTask = updatedTasks.find(t => t.id === id)!;
  return updatedTask;
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = getStoredTasks();
  saveStoredTasks(tasks.filter(t => t.id !== id));
}

export interface Stats {
  total: number;
  completed: number;
  pending: number;
  byPriority: Record<Priority, number>;
}

export async function fetchStats(): Promise<Stats> {
  const tasks = getStoredTasks();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const byPriority: Record<Priority, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
  tasks.forEach(t => { byPriority[t.priority]++; });
  return { total, completed, pending, byPriority };
}