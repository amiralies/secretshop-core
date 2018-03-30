import Joi from 'joi';

/**
 * Joi validation middleware
 * @param {object} schema schema object
 * @param {object} options joi validation options
 */
function validate(schema, options = {}) {
  return async (req, res, next) => {
    const toValidate = {};
    const reqKeys = ['headres', 'params', 'query', 'body'];

    reqKeys.forEach((key) => {
      if (schema[key]) {
        toValidate[key] = req[key];
      }
    });

    try {
      await Joi.validate(toValidate, schema, options);
      next();
    } catch (err) {
      if (err.isJoi && err.name === 'ValidationError') {
        err.status = 400;
        next(err);
      } else next(err);
    }
  };
}

export default validate;
