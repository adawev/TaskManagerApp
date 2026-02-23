export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
