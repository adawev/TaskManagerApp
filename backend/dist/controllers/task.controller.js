"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTasks = fetchTasks;
exports.createTaskHandler = createTaskHandler;
exports.updateTaskHandler = updateTaskHandler;
exports.deleteTaskHandler = deleteTaskHandler;
exports.getStatsHandler = getStatsHandler;
const task_service_1 = require("../services/task.service");
function fetchTasks(req, res) {
    const filters = {};
    if (req.query.priority) {
        filters.priority = req.query.priority;
    }
    if (req.query.completed) {
        filters.completed = req.query.completed === 'true';
    }
    const tasks = (0, task_service_1.getTasks)(filters);
    res.json(tasks);
}
function createTaskHandler(req, res) {
    const task = (0, task_service_1.createTask)({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority
    });
    res.status(201).json(task);
}
function updateTaskHandler(req, res) {
    const task = (0, task_service_1.updateTask)(req.params.id, req.body);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
}
function deleteTaskHandler(req, res) {
    const deleted = (0, task_service_1.deleteTask)(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
}
function getStatsHandler(_req, res) {
    const stats = (0, task_service_1.getStats)();
    res.json(stats);
}
