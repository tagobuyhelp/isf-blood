import request from 'supertest';

describe('Donors and Requests API', () => {
  test('GET /api/v1/donors/top returns 200 with donors array', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app).get('/api/v1/donors/top');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data.donors');
    expect(Array.isArray(res.body.data.donors)).toBe(true);
  });

  test('GET /api/v1/donors/search validates required lat/lng', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app).get('/api/v1/donors/search');
    expect(res.status).toBe(400);
  });

  test('GET /api/v1/requests returns 200 with results array', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app).get('/api/v1/requests');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data.results');
    expect(Array.isArray(res.body.data.results)).toBe(true);
  });

  test('GET /api/v1/requests/:id returns 200 for any id', async () => {
    const app = (await import('../app.js')).default;
    const res = await request(app).get('/api/v1/requests/abc123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data.request');
  });
});