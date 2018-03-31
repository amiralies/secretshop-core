import express from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import validate from '../../middlewares/validate';
import { genHttpError, sha256 } from '../../utils/helpers';
import { genRefreshToken, genAccessToken } from '../../utils/tokenGenerator';

const router = express.Router();
const User = mongoose.model('User');
const Session = mongoose.model('Session');

router.post('/', validate({
  body: Joi.object().keys({
    grantType: Joi.string()
      .valid('password', 'refreshToken')
      .required(),
    email: Joi.string()
      .email()
      .when('grantType', { is: 'password', then: Joi.required(), otherwise: Joi.forbidden() }),
    password: Joi.string()
      .when('grantType', { is: 'password', then: Joi.required(), otherwise: Joi.forbidden() }),
    refreshToken: Joi.string()
      .when('grantType', { is: 'refreshToken', then: Joi.required(), otherwise: Joi.forbidden() }),
  }),
}), async (req, res, next) => {
  const { grantType } = req.body;

  if (grantType === 'password') {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) throw genHttpError(400, 'User not found');
      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw genHttpError(400, 'Wrong password');
      const refreshToken = genRefreshToken();
      const accessToken = await genAccessToken(user._id);
      await new Session({ userId: user._id, refreshToken: sha256(refreshToken) }).save();

      res.status(201).json({
        success: true,
        message: 'Login session created successfully',
        refreshToken,
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  }

  if (grantType === 'refreshToken') {
    const { refreshToken } = req.body;
    try {
      const session = await Session.findOne({ refreshToken: sha256(refreshToken) });
      if (!session) throw genHttpError(400, 'Invalid refreshToken');
      const accessToken = await genAccessToken(session.userId);

      res.status(201).json({
        success: true,
        message: 'Access token generated successfully',
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  }
});

export default router;
