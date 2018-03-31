import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../src/app';

const User = mongoose.model('User');
const server = request.agent(app);

const mockUser = {
  name: 'Paul gilbert',
  email: 'gilbert@aol.com',
  password: 'nicenstrongpw',
};

const existingUser = {
  name: 'Carl johnson',
  email: 'existing@aol.com',
  password: 'anothernicenstrongpw',
};

describe('/auth/register route', () => {
  beforeAll(async () => {
    await server.post('/auth/register')
      .send(existingUser);
  });

  it('should fail on registering a user with no name', async () => {
    const noNameUser = { email: mockUser.email, password: mockUser.password };
    const { statusCode, body } = await server.post('/auth/register')
      .send(noNameUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "name" fails because ["name" is required]]');
  });

  it('should fail on registering a user with no email', async () => {
    const noMailUser = { name: mockUser.name, password: mockUser.password };
    const { statusCode, body } = await server.post('/auth/register')
      .send(noMailUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "email" fails because ["email" is required]]');
  });

  it('should fail on registering a user with invalid email', async () => {
    const invalidMailUser = { ...mockUser, email: 'invalidMail' };
    const { statusCode, body } = await server.post('/auth/register')
      .send(invalidMailUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "email" fails because ["email" must be a valid email]]');
  });

  it('should fail on registering a user with no password', async () => {
    const noPasswordUser = { name: mockUser.name, email: mockUser.email };
    const { statusCode, body } = await server.post('/auth/register')
      .send(noPasswordUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "password" fails because ["password" is required]]');
  });

  it('should fail on registering a user with invalid password', async () => {
    const invalidPasswordUser = { ...mockUser, password: '1234' };
    const { statusCode, body } = await server.post('/auth/register')
      .send(invalidPasswordUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "password" fails because ["password" length must be at least 6 characters long]]');
  });

  it('should fail on registering auser with existing email', async () => {
    const { statusCode, body } = await server.post('/auth/register')
      .send(existingUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('Email already exists');
  });

  it('should register a user successfully', async () => {
    const { statusCode, body } = await server.post('/auth/register')
      .send(mockUser);
    expect(statusCode).toBe(201);
    expect(body.user.name).toBe(mockUser.name);
    expect(body.user.email).toBe(mockUser.email);
  });

  afterAll(async () => {
    await User.remove({ email: mockUser.email });
  });
});
