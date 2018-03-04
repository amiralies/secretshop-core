import express from 'express';
import products from './products';
import auth from './auth';

const router = express.Router();

router.use('/auth', auth);
router.use('/products', products);

export default router;
