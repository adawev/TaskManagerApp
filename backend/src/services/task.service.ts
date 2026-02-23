import { v4 as uuidv4 } from 'uuid';
import { Task, Priority } from '../models/task.model';
import { tasks } from '../data/task.store';

export type TaskFilters = {
  priority?: Priority;
  completed?: boolean;
};

export function getTasks(filters?: TaskFilters): Task[] {
  return tasks.filter((task) => {
    if (filters?.priority && task.priority !== filters.priority) {
      return false;
    }
    if (typeof filters?.completed === 'boolean' && task.completed !== filters.completed) {
      return false;
    }
    return true;
  });
}

export function createTask(data: {
  title: string;
  description?: string;
  priority: Priority;
}): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: uuidv4(),
    title: data.title,
    description: data.description,
    priority: data.priority,
    completed: false,
    createdAt: now
  };
  tasks.push(task);
  return task;
}

export function getTaskById(id: string): Task | undefined {
  return tasks.find((task) => task.id === id);
}

export function updateTask(id: string, updates: Partial<Pick<Task, 'title' | 'priority' | 'completed'>>): Task | undefined {
  const task = getTaskById(id);
  if (!task) {
    return undefined;
  }

  if (updates.title !== undefined) {
    task.title = updates.title;
  }

  if (updates.priority) {
    task.priority = updates.priority;
  }

  if (typeof updates.completed === 'boolean') {
    task.completed = updates.completed;
    task.completedAt = updates.completed ? new Date().toISOString() : undefined;
  }

  return task;
}

export function deleteTask(id: string): boolean {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return false;
  }
  tasks.splice(index, 1);
  return true;
}

export function getStats(): {
  total: number;
  completed: number;
  pending: number;
  byPriority: Record<Priority, number>;
} {
  const byPriority: Record<Priority, number> = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0
  };

  let completed = 0;

  tasks.forEach((task) => {
    byPriority[task.priority] += 1;
    if (task.completed) {
      completed += 1;
    }
  });

  const total = tasks.length;
  const pending = total - completed;

  return {
    total,
    completed,
    pending,
    byPriority
  };
}
