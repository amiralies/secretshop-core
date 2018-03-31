import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../src/app';

const User = mongoose.model('User');
const Session = mongoose.model('Session');
const server = request.agent(app);

const mockUser = {
  grantType: 'password',
  email: 'testUser@live.com',
  password: 'testPassword',
};

const mockUserWithRefreshToken = {
  grantType: 'refreshToken',
  refreshToken: '',
};

describe('/auth/register route', () => {
  beforeAll(async () => {
    await server.post('/auth/register')
      .send({ name: 'Steve jones', email: mockUser.email, password: mockUser.password });
    const { body } = await server.post('/auth/login')
      .send(mockUser);
    mockUserWithRefreshToken.refreshToken = body.refreshToken;
  });

  it('should fail on login a user with no grantType', async () => {
    const noGrantTypeUser = { email: mockUser.email, password: mockUser.password };
    const { statusCode, body } = await server.post('/auth/login')
      .send(noGrantTypeUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "grantType" fails because ["grantType" is required]]');
  });

  it('should fail on login a user with invalid grantType', async () => {
    const invalidGrantTypeUser = { ...mockUser, grantType: 'invalidGrantType' };
    const { statusCode, body } = await server.post('/auth/login')
      .send(invalidGrantTypeUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "grantType" fails because ["grantType" must be one of [password, refreshToken]]]');
  });

  it('should fail on login a user with invalid email', async () => {
    const invalidMailUser = { ...mockUser, email: 'invalidMail' };
    const { statusCode, body } = await server.post('/auth/login')
      .send(invalidMailUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "email" fails because ["email" must be a valid email]]');
  });

  it('should fail on login a user with no email', async () => {
    const noMailUser = { grantType: mockUser.grantType, password: mockUser.password };
    const { statusCode, body } = await server.post('/auth/login')
      .send(noMailUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "email" fails because ["email" is required]]');
  });

  it('should fail on login a user with no password', async () => {
    const noPasswordUser = { grantType: mockUser.grantType, email: mockUser.email };
    const { statusCode, body } = await server.post('/auth/login')
      .send(noPasswordUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "password" fails because ["password" is required]]');
  });

  it('should fail on login with unregistered email', async () => {
    const unregisteredMailUser = { ...mockUser, email: 'unregistered@thisisunregistered.io' };
    const { statusCode, body } = await server.post('/auth/login')
      .send(unregisteredMailUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('User not found');
  });

  it('should fail on login with wrong password', async () => {
    const wrongPasswordUser = { ...mockUser, password: 'wrongPw' };
    const { statusCode, body } = await server.post('/auth/login')
      .send(wrongPasswordUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('Wrong password');
  });

  it('should login a user with email and password successfully', async () => {
    const { statusCode, body } = await server.post('/auth/login').send(mockUser);
    expect(statusCode).toBe(201);
    expect(typeof body.refreshToken).toBe('string');
    expect(body.refreshToken).not.toBe('');
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken).not.toBe('');
  });

  it('should fail on obtain an accessToken with no grantType', async () => {
    const noGrantTypeUser = { refreshToken: mockUserWithRefreshToken.refreshToken };
    const { statusCode, body } = await server.post('/auth/login')
      .send(noGrantTypeUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "grantType" fails because ["grantType" is required]]');
  });

  it('should fail on obtain an accessToken with invalid grantType', async () => {
    const invalidGrantTypeUser = { ...mockUserWithRefreshToken, grantType: 'invalidGrantType' };
    const { statusCode, body } = await server.post('/auth/login')
      .send(invalidGrantTypeUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "grantType" fails because ["grantType" must be one of [password, refreshToken]]]');
  });

  it('should fail on obtain an accessToken with invalid refreshToken', async () => {
    const invalidRefreshTokenUser = { ...mockUserWithRefreshToken, refreshToken: 'invalidRefreshToken' };
    const { statusCode, body } = await server.post('/auth/login')
      .send(invalidRefreshTokenUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('Invalid refreshToken');
  });

  it('should fail on obtain an accessToken with no refreshToken', async () => {
    const noRefreshTokenUser = { grantType: mockUserWithRefreshToken.grantType };
    const { statusCode, body } = await server.post('/auth/login')
      .send(noRefreshTokenUser);
    expect(statusCode).toBe(400);
    expect(body.error.message).toBe('child "body" fails because [child "refreshToken" fails because ["refreshToken" is required]]');
  });

  it('should obtain an accesToken successfully', async () => {
    const { statusCode, body } = await server.post('/auth/login').send(mockUserWithRefreshToken);
    expect(statusCode).toBe(201);
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken).not.toBe('');
  });

  afterAll(async () => {
    const user = await User.findOneAndRemove({ email: mockUser.email });
    await Session.remove({ userId: user._id });
  });
});
