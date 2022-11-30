export default {
  APP_ENV: process.env.APP_ENV,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO: {
    URI: process.env.MARKETPLACE_MONGODB_URI,
  },
  EMAIL_SERVICE_URI: process.env.EMAIL_SERVICE_URI,
};
