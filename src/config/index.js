const { NODE_ENV, PORT, MONGO_URL } = process.env;

const config = {
  env: NODE_ENV,
  port: PORT || 3000,
  mongoUrl: MONGO_URL || 'mongodb://localhost:27017/secretshop',
};

export default config;
