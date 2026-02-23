import { Priority, Task } from '../types/task.types';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

type TaskFilters = {
  priority?: Priority;
  completed?: boolean;
};

function buildQuery(filters?: TaskFilters) {
  if (!filters) {
    return '';
  }
  const params = new URLSearchParams();
  if (filters.priority) {
    params.set('priority', filters.priority);
  }
  if (typeof filters.completed === 'boolean') {
    params.set('completed', filters.completed ? 'true' : 'false');
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.json().catch(() => null);
    throw new Error((message && (message as { message?: string }).message) ?? 'API error');
  }
  return res.json();
}

export async function fetchTasks(filters?: TaskFilters): Promise<Task[]> {
  const query = buildQuery(filters);
  const response = await fetch(`${API_BASE}/api/tasks${query}`);
  return handleResponse<Task[]>(response);
}

export async function createTask(payload: {
  title: string;
  description?: string;
  priority: Priority;
}): Promise<Task> {
  const response = await fetch(`${API_BASE}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handleResponse<Task>(response);
}

export async function updateTask(id: string, updates: Partial<{ title: string; priority: Priority; completed: boolean }>): Promise<Task> {
  const response = await fetch(`${API_BASE}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return handleResponse<Task>(response);
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/tasks/${id}`, { method: 'DELETE' });
  await handleResponse<void>(response);
}

export interface Stats {
  total: number;
  completed: number;
  pending: number;
  byPriority: Record<Priority, number>;
}

export async function fetchStats(): Promise<Stats> {
  const response = await fetch(`${API_BASE}/api/tasks/stats`);
  return handleResponse<Stats>(response);
}
