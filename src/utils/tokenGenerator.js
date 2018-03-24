import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from 'util';
import config from '../config';

const randomBytes = promisify(crypto.randomBytes);
const jwtSign = promisify(jwt.sign);

/**
 * Generates a cryptographic random hash as refresh token
 * @async
 * @returns {Promise<string>} Promise object resolved with refresh token
 */
async function genRefreshToken() {
  const buffer = await randomBytes(256);
  const refreshToken = crypto.createHash('sha1').update(buffer).digest('hex');
  return refreshToken;
}

/**
 * Generates a jwt access token for particular userId
 * @async
 * @param {string} userId user id to be signed
 * @returns {Promise<string>} Promise object resolved with access token
 */
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
