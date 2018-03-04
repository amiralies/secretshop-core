import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../src/app';

const User = mongoose.model('User');
const server = request.agent(app);

jest.setTimeout(10000);

const mockUser = {
  name: 'Paul gilbert',
  email: 'gilbert@aol.com',
  password: 'nicenstrongpw',
};

describe('/auth/register route', () => {
  it('should fail on registering a user with invalid email', async () => {
    const invalidMailUser = { ...mockUser, email: 'invalidMail' };
    const { statusCode, body } = await server.post('/auth/register')
      .send(invalidMailUser);
    expect(statusCode).toBe(400);
    expect(body.message).toBe('Invalid email');
  });

  it('should fail on registering a user with invalid password', async () => {
    const invalidPasswordUser = { ...mockUser, password: '1234' };
    const { statusCode, body } = await server.post('/auth/register')
      .send(invalidPasswordUser);
    expect(statusCode).toBe(400);
    expect(body.message).toBe('Invalid password');
  });

  it('should register a user successfully', async () => {
    const { statusCode, body } = await server.post('/auth/register')
      .send(mockUser);
    expect(statusCode).toBe(201);
    expect(body.success).toBeTruthy();
    expect(body.message).toBe('User created successfully');
  });

  afterAll(async () => {
    await User.remove({ email: mockUser.email });
    mongoose.connection.close();
  });
});