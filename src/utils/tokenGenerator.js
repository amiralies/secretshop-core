import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import uuidv4 from 'uuid/v4';
import config from '../config';

const jwtSign = promisify(jwt.sign);

/**
 * Generates a uuidv4 as refresh token
 * @returns {string} uuid refresh token
 */
function genRefreshToken() {
  const refreshToken = uuidv4();
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
