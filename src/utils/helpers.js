function genHttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export { genHttpError }; // eslint-disable-line import/prefer-default-export
