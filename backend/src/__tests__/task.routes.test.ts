import request from 'supertest';
import app from '../app';
import { tasks } from '../data/task.store';

const base = '/api/tasks';

describe('Task API', () => {
  beforeEach(() => {
    tasks.splice(0, tasks.length);
  });

  it('creates and returns a task with defaults', async () => {
    const payload = { title: 'Test task', priority: 'medium' };
    const response = await request(app).post(base).send(payload);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test task');
    expect(response.body.priority).toBe('medium');
    expect(response.body.completed).toBe(false);
    expect(response.body.completedAt).toBeUndefined();
  });

  it('rejects invalid priority during creation', async () => {
    const response = await request(app).post(base).send({ title: 'Bad', priority: 'super' });
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Priority must be one of/);
  });

  it('filters by priority and completion', async () => {
    await request(app).post(base).send({ title: 'Low task', priority: 'low' });
    await request(app).post(base).send({ title: 'High done', priority: 'high' });
    await request(app).patch(`${base}/${tasks[1].id}`).send({ completed: true });

    const response = await request(app).get(base).query({ completed: 'true', priority: 'high' });
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('High done');
  });

  it('toggles completion and removes completedAt when undone', async () => {
    const create = await request(app).post(base).send({ title: 'Toggle task', priority: 'low' });
    const id = create.body.id;

    const completed = await request(app).patch(`${base}/${id}`).send({ completed: true });
    expect(completed.body.completed).toBe(true);
    expect(completed.body.completedAt).toBeTruthy();

    const undone = await request(app).patch(`${base}/${id}`).send({ completed: false });
    expect(undone.body.completed).toBe(false);
    expect(undone.body.completedAt).toBeUndefined();
  });

  it('deletes a task and returns confirmation', async () => {
    const create = await request(app).post(base).send({ title: 'Delete me', priority: 'medium' });
    const response = await request(app).delete(`${base}/${create.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');
    expect(tasks).toHaveLength(0);
  });

  it('returns stats with totals and breakdown', async () => {
    await request(app).post(base).send({ title: 'One low', priority: 'low' });
    await request(app).post(base).send({ title: 'Two medium', priority: 'medium' });
    await request(app).post(base).send({ title: 'Urgent now', priority: 'urgent' });
    await request(app).patch(`${base}/${tasks[2].id}`).send({ completed: true });

    const stats = await request(app).get(`${base}/stats`);
    expect(stats.body.total).toBe(3);
    expect(stats.body.completed).toBe(1);
    expect(stats.body.pending).toBe(2);
    expect(stats.body.byPriority).toEqual({ low: 1, medium: 1, high: 0, urgent: 1 });
  });

  it('returns 404 for missing task on update/delete', async () => {
    await expect(request(app).patch(`${base}/invalid`).send({ completed: true })).resolves.toMatchObject({
      status: 404
    });
    await expect(request(app).delete(`${base}/missing`)).resolves.toMatchObject({
      status: 404
    });
  });
});
