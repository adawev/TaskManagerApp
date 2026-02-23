"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasks = getTasks;
exports.createTask = createTask;
exports.getTaskById = getTaskById;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.getStats = getStats;
const uuid_1 = require("uuid");
const task_store_1 = require("../data/task.store");
function getTasks(filters) {
    return task_store_1.tasks.filter((task) => {
        if (filters?.priority && task.priority !== filters.priority) {
            return false;
        }
        if (typeof filters?.completed === 'boolean' && task.completed !== filters.completed) {
            return false;
        }
        return true;
    });
}
function createTask(data) {
    const now = new Date().toISOString();
    const task = {
        id: (0, uuid_1.v4)(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        completed: false,
        createdAt: now
    };
    task_store_1.tasks.push(task);
    return task;
}
function getTaskById(id) {
    return task_store_1.tasks.find((task) => task.id === id);
}
function updateTask(id, updates) {
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
function deleteTask(id) {
    const index = task_store_1.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
        return false;
    }
    task_store_1.tasks.splice(index, 1);
    return true;
}
function getStats() {
    const byPriority = {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
    };
    let completed = 0;
    task_store_1.tasks.forEach((task) => {
        byPriority[task.priority] += 1;
        if (task.completed) {
            completed += 1;
        }
    });
    const total = task_store_1.tasks.length;
    const pending = total - completed;
    return {
        total,
        completed,
        pending,
        byPriority
    };
}
