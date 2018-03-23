import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from 'util';
import config from '../config';

const randomBytes = promisify(crypto.randomBytes);
const jwtSign = promisify(jwt.sign);

async function genRefreshToken() {
  const buffer = await randomBytes(256);
  const refreshToken = crypto.createHash('sha1').update(buffer).digest('hex');
  return refreshToken;
}

async function genAccessToken(userId) {
  const payload = {
    sub: userId,
    iat: Date.now(),
    typ: 'access',
  };
  const accessToken = await jwtSign(payload, config.jwtSecret, { expiresIn: '1h' });
  return accessToken;
}

export { genRefreshToken, genAccessToken };
