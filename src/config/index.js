const {
  NODE_ENV,
  PORT,
  MONGO_URL,
  JWT_SECRET,
} = process.env;

const config = {
  env: NODE_ENV || 'dev',
  port: PORT || 3000,
  mongoUrl: MONGO_URL || 'mongodb://localhost:27017/secretshop',
  jwtSecret: JWT_SECRET || 'supersecretjwtdevkey',
};

export default config;
