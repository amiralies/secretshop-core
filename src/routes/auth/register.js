import express from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { genHttpError } from '../../utils/helpers';

const router = express.Router();
const User = mongoose.model('User');

router.post('/', async (req, res, next) => {
  const bodySchema = Joi.object().keys({
    name: Joi.string()
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
  });

  try {
    const body = await bodySchema.validate(req.body);
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
    if (err.code === 11000) {
      next(genHttpError(400, 'Email already exists'));
    } else {
      next(err);
    }
  }
});

export default router;
