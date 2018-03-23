import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../src/app';

const User = mongoose.model('User');
const Session = mongoose.model('Session');
const server = request.agent(app);

jest.setTimeout(10000);

const mockUser = {
  email: 'testUser@live.com',
  password: 'testPassword',
};

describe('/auth/register route', () => {
  it('should fail on login a user with invalid email', async () => {
    const invalidMailUser = { ...mockUser, email: 'invalidMail' };
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

  it('should register and login a user successfully', async () => {
    const registerResponse = await server.post('/auth/register')
      .send({ ...mockUser, name: 'Steve jones' });
    expect(registerResponse.statusCode).toBe(201);
    expect(registerResponse.body.success).toBeTruthy();
    expect(registerResponse.body.message).toBe('User created successfully');

    const { statusCode, body } = await server.post('/auth/login').send(mockUser);
    expect(statusCode).toBe(201);
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Login session created successfully');
    expect(body.refreshToken).toBeDefined();
    expect(body.accessToken).toBeDefined();
  });

  afterAll(async () => {
    const userId = await User.findOne({ email: mockUser.email });
    await User.remove({ _id: userId });
    await Session.remove({ userId });
    mongoose.connection.close();
  });
});
