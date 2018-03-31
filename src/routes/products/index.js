import express from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';
import validate from '../../middlewares/validate';

const router = express.Router();
const Product = mongoose.model('Product');

router.get('/', validate({
  query: Joi.object().keys({
    limit: Joi.number().min(1).max(200),
    offset: Joi.number().min(0),
  }),
}), async (req, res, next) => {
  const { query } = req;

  try {
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 100;
    const totalResult = await Product.count({});
    const products = await Product.find({}).skip(offset).limit(limit);

    res.status(200).json({
      totalResult,
      offset,
      currentResult: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
