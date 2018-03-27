import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from 'util';
import uuidv4 from 'uuid/v4';
import config from '../config';

const jwtSign = promisify(jwt.sign);

/**
 * Generates a uuidv4 and its hash as refresh token
 * @returns {{plain: string, hashed: string}} plain and hashed refreshToken
 */
function genRefreshToken() {
  const plain = uuidv4();
  const hashed = crypto.createHash('sha256').update(plain).digest('hex');
  const refreshToken = { plain, hashed };
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
