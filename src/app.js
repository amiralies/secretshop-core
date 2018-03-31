import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config';
import './models';
import routes from './routes';

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl).catch((err) => {
  console.error(err); // eslint-disable-line no-console
});

if (app.get('env') === 'production') {
  app.use(logger('common'));
} else if (app.get('env') === 'dev') {
  app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const { message } = err;
  const status = err.status || 500;
  res.status(status).json({ error: { code: status, message } });
});

export default app;
