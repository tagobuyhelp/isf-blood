import request from 'supertest';

describe('Health and Public API', () => {
  test('GET /api/v1/health returns success', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('API is running');
  });

  test('GET /api/v1/public/stats returns counts', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app).get('/api/v1/public/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('counts');
    expect(res.body.data.counts).toHaveProperty('donors');
  });
});