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

export { genHttpError }; // eslint-disable-line import/prefer-default-export
