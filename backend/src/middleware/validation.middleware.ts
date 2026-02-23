import { Request, Response, NextFunction } from 'express';
import { Priority, priorities } from '../models/task.model';

export function validateTaskQuery(req: Request, res: Response, next: NextFunction) {
  const priority = req.query.priority;
  if (priority && typeof priority !== 'string') {
    return res.status(400).json({ message: 'Invalid priority filter' });
  }

  if (priority && !priorities.includes(priority as Priority)) {
    return res.status(400).json({ message: 'Invalid priority filter' });
  }

  const completed = req.query.completed;
  if (completed && completed !== 'true' && completed !== 'false') {
    return res.status(400).json({ message: 'Invalid completed filter' });
  }

  return next();
}

export function validateTaskCreation(req: Request, res: Response, next: NextFunction) {
  const { title, priority } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (!priority || !priorities.includes(priority)) {
    return res.status(400).json({ message: 'Priority must be one of low, medium, high, urgent' });
  }

  return next();
}

export function validateTaskUpdate(req: Request, res: Response, next: NextFunction) {
  const { title, priority, completed } = req.body;
  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ message: 'Title must be a non-empty string' });
  }

  if (priority !== undefined && !priorities.includes(priority)) {
    return res.status(400).json({ message: 'Priority must be one of low, medium, high, urgent' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'Completed must be a boolean' });
  }

  return next();
}
