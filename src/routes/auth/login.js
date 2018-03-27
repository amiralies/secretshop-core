import express from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import { genHttpError } from '../../utils/helpers';
import { genRefreshToken, genAccessToken } from '../../utils/tokenGenerator';

const router = express.Router();
const User = mongoose.model('User');
const Session = mongoose.model('Session');

router.post('/', async (req, res, next) => {
  const bodySchema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required()
      .error(genHttpError(400, 'Invalid email')),
    password: Joi.string()
      .required()
      .error(genHttpError(400, 'Invalid password')),
  });

  try {
    const body = await bodySchema.validate(req.body);
    const { email, password } = body;
    const user = await User.findOne({ email });
    if (!user) throw genHttpError(400, 'User not found');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw genHttpError(400, 'Wrong password');
    const refreshToken = genRefreshToken();
    const accessToken = await genAccessToken(user._id);
    await new Session({ userId: user._id, refreshToken: refreshToken.hashed }).save();

    res.status(201).json({
      success: true,
      message: 'Login session created successfully',
      refreshToken: refreshToken.plain,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
