import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../src/app';

const User = mongoose.model('User');
const Session = mongoose.model('Session');
const server = request.agent(app);

const mockUser = {
  email: 'testUser@live.com',
  password: 'testPassword',
};

describe('/auth/register route', () => {
  beforeAll(async () => {
    await server.post('/auth/register')
      .send({ ...mockUser, name: 'Steve jones' });
  });

  it('should fail on login a user with invalid email', async () => {
    const invalidMailUser = { ...mockUser, email: 'invalidMail' };
    const { statusCode, body } = await server.post('/auth/login')
      .send(invalidMailUser);
    expect(statusCode).toBe(400);
    expect(body.message).toBe('Invalid email');
  });

  it('should fail on login a user with no email', async () => {
    const invalidMailUser = { password: mockUser.password };
    const { statusCode, body } = await server.post('/auth/login')
      .send(invalidMailUser);
    expect(statusCode).toBe(400);
    expect(body.message).toBe('Invalid email');
  });

  it('should fail on login a user with no password', async () => {
    const invalidPasswordUser = { email: mockUser.email };
    const { statusCode, body } = await server.post('/auth/login')
      .send(invalidPasswordUser);
    expect(statusCode).toBe(400);
    expect(body.message).toBe('Invalid password');
  });

  it('should fail on login with unregistered email', async () => {
    const invalidMailUser = { ...mockUser, email: 'unregistered@thisisunregistered.io' };
    const { statusCode, body } = await server.post('/auth/login')
      .send(invalidMailUser);
    expect(statusCode).toBe(400);
    expect(body.message).toBe('User not found');
  });

  it('should fail on login with wrong password', async () => {
    const invalidMailUser = { ...mockUser, password: 'wrongPw' };
    const { statusCode, body } = await server.post('/auth/login')
      .send(invalidMailUser);
    expect(statusCode).toBe(400);
    expect(body.message).toBe('Wrong password');
  });

  it('should login a user successfully', async () => {
    const { statusCode, body } = await server.post('/auth/login').send(mockUser);
    expect(statusCode).toBe(201);
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Login session created successfully');
    expect(typeof body.refreshToken).toBe('string');
    expect(body.refreshToken).not.toBe('');
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken).not.toBe('');
  });

  afterAll(async () => {
    const userId = await User.findOne({ email: mockUser.email });
    await User.remove({ _id: userId });
    await Session.remove({ userId });
  });
});
