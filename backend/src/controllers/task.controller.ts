import { Request, Response } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getStats,
  TaskFilters
} from '../services/task.service';

export function fetchTasks(req: Request, res: Response) {
  const filters: TaskFilters = {};
  if (req.query.priority) {
    filters.priority = req.query.priority as any;
  }
  if (req.query.completed) {
    filters.completed = req.query.completed === 'true';
  }
  const tasks = getTasks(filters);
  res.json(tasks);
}

export function createTaskHandler(req: Request, res: Response) {
  const task = createTask({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority
  });
  res.status(201).json(task);
}

export function updateTaskHandler(req: Request, res: Response) {
  const task = updateTask(req.params.id, req.body);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
}

export function deleteTaskHandler(req: Request, res: Response) {
  const deleted = deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json({ message: 'Task deleted successfully' });
}

export function getStatsHandler(_req: Request, res: Response) {
  const stats = getStats();
  res.json(stats);
}
