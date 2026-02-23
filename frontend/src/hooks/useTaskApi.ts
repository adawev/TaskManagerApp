import { useCallback, useState } from 'react';
import { Task, Priority } from '../types/task.types';
import * as taskApi from '../services/taskApi';

export type TaskFilters = {
  priority?: Priority;
  completed?: boolean;
};

export function useTaskApi() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskApi.fetchTasks(filters);
      setTasks(data);
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (payload: { title: string; description?: string; priority: Priority }) => {
    try {
      const task = await taskApi.createTask(payload);
      setTasks((prev) => [task, ...prev]);
      return task;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<{ title: string; priority: Priority; completed: boolean }>) => {
    try {
      const task = await taskApi.updateTask(id, updates);
      setTasks((prev) => prev.map((item) => (item.id === id ? task : item)));
      return task;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}
