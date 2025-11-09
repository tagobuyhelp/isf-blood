import request from 'supertest';

describe('Protected and Push Routes', () => {
  test('GET /api/v1/messages/threads requires auth', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app).get('/api/v1/messages/threads');
    expect(res.status).toBe(401);
  });

  test('POST /api/v1/messages/threads requires auth', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app)
      .post('/api/v1/messages/threads')
      .send({ requestId: 'req1', participantId: 'user2' });
    expect(res.status).toBe(401);
  });

  test('GET /api/v1/notifications requires auth', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app).get('/api/v1/notifications');
    expect(res.status).toBe(401);
  });

  test('POST /api/v1/notifications/:id/read requires auth', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app).post('/api/v1/notifications/n1/read');
    expect(res.status).toBe(401);
  });

  test('GET /api/v1/admin/users requires auth', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app).get('/api/v1/admin/users');
    expect(res.status).toBe(401);
  });

  test('POST /api/v1/push/subscribe validates payload', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app)
      .post('/api/v1/push/subscribe')
      .send({});
    expect(res.status).toBe(400);
  });
});