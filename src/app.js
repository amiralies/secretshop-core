import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config';
import './models';

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl).catch((err) => {
  console.error(err); // eslint-disable-line no-console
});

if (app.get('env') === 'production') {
  app.use(logger('common'));
} else {
  app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'helloworld' });
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const { status, message } = err;
  res.status(status).json({ success: false, status, message });
});

app.listen(config.port);
