import express from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';
import { genHttpError } from '../../utils/helpers';

const router = express.Router();
const Product = mongoose.model('Product');

router.get('/', async (req, res, next) => {
  const querySchema = {
    limit: Joi.number().min(1).max(200).error(genHttpError(400, 'Bad limit parameter')),
    offset: Joi.number().min(0).error(genHttpError(400, 'Bad offset parameter')),
  };

  try {
    const query = await Joi.validate(req.query, querySchema);
    const offset = parseInt(query.offset, 10) || 0;
    const limit = parseInt(query.limit, 10) || 100;
    const totalResult = await Product.count({});
    const products = await Product.find({}).skip(offset).limit(limit);

    res.status(200).json({
      success: true,
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