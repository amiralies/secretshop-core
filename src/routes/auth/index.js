import express from 'express';
import register from './register';

const router = express.Router();

router.use('/register', register);

export default router;
