import crypto from 'crypto';

/**
 * Generates a http error with status code and error message
 * @param {number} status Http status code
 * @param {string} message Error message
 * @returns {object} Error object
 */
function genHttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/**
 * sha256 of a string or buffer
 * @param {string|Buffer} input a string or buffer to be hashed
 * @returns {string} hex hash string of input
 */
function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export { genHttpError, sha256 };
