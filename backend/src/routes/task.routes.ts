import { Router } from 'express';
import {
  fetchTasks,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
  getStatsHandler
} from '../controllers/task.controller';
import {
  validateTaskQuery,
  validateTaskCreation,
  validateTaskUpdate
} from '../middleware/validation.middleware';

const router = Router();

router.get('/stats', getStatsHandler);
router.get('/', validateTaskQuery, fetchTasks);
router.post('/', validateTaskCreation, createTaskHandler);
router.patch('/:id', validateTaskUpdate, updateTaskHandler);
router.delete('/:id', deleteTaskHandler);

export default router;
