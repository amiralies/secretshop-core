import express from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { genHttpError } from '../../utils/helpers';

const router = express.Router();
const User = mongoose.model('User');

router.post('/', async (req, res, next) => {
  const userRegistrationSchema = {
    name: Joi.string()
      .required()
      .error(genHttpError(400, 'Invalid name')),
    email: Joi.string()
      .email()
      .required()
      .error(genHttpError(400, 'Invalid email')),
    password: Joi.string()
      .min(6)
      .required()
      .error(genHttpError(400, 'Invalid password')),
  };

  try {
    const body = await Joi.validate(req.body, userRegistrationSchema);
    const { name, email, password } = body;
    const user = await new User({ name, email, password }).save();
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});
export default router;
