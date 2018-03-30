import express from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import validate from '../../middlewares/validate';
import { genHttpError } from '../../utils/helpers';

const router = express.Router();
const User = mongoose.model('User');

router.post('/', validate({
  body: Joi.object().keys({
    name: Joi.string()
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
  }),
}), async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
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
