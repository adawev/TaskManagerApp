"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskQuery = validateTaskQuery;
exports.validateTaskCreation = validateTaskCreation;
exports.validateTaskUpdate = validateTaskUpdate;
const task_model_1 = require("../models/task.model");
function validateTaskQuery(req, res, next) {
    const priority = req.query.priority;
    if (priority && typeof priority !== 'string') {
        return res.status(400).json({ message: 'Invalid priority filter' });
    }
    if (priority && !task_model_1.priorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority filter' });
    }
    const completed = req.query.completed;
    if (completed && completed !== 'true' && completed !== 'false') {
        return res.status(400).json({ message: 'Invalid completed filter' });
    }
    return next();
}
function validateTaskCreation(req, res, next) {
    const { title, priority } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ message: 'Title is required' });
    }
    if (!priority || !task_model_1.priorities.includes(priority)) {
        return res.status(400).json({ message: 'Priority must be one of low, medium, high, urgent' });
    }
    return next();
}
function validateTaskUpdate(req, res, next) {
    const { title, priority, completed } = req.body;
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
        return res.status(400).json({ message: 'Title must be a non-empty string' });
    }
    if (priority !== undefined && !task_model_1.priorities.includes(priority)) {
        return res.status(400).json({ message: 'Priority must be one of low, medium, high, urgent' });
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Completed must be a boolean' });
    }
    return next();
}
