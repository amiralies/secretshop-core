const { PORT, NODE_ENV } = process.env;

export default {
  app: {
    port: PORT,
    env: NODE_ENV,
  },
};
