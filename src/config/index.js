const { NODE_ENV, PORT } = process.env;

const config = {
  env: NODE_ENV,
  port: PORT || 3000,
};

export default config;
