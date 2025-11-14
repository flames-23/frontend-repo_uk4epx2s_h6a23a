import request from 'supertest';
import { app, connectDB } from '../app';
import mongoose from 'mongoose';

describe('Auth', () => {
  beforeAll(async () => {
    await connectDB('mongodb://localhost:27017/agrawal_frankie_test');
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it('registers and logs in a user', async () => {
    const reg = await request(app).post('/api/auth/register').send({ name: 'Test', email: 't@example.com', password: 'secret' });
    expect(reg.status).toBe(200);
    expect(reg.body.token).toBeDefined();

    const login = await request(app).post('/api/auth/login').send({ email: 't@example.com', password: 'secret' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });
});
