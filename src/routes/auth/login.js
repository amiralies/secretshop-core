import express from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import validate from '../../middlewares/validate';
import { genHttpError } from '../../utils/helpers';
import { genRefreshToken, genAccessToken } from '../../utils/tokenGenerator';

const router = express.Router();
const User = mongoose.model('User');
const Session = mongoose.model('Session');

router.post('/', validate({
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required(),
  }),
}), async (req, res, next) => {
  const { email, password } = req.body;

  try {
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
