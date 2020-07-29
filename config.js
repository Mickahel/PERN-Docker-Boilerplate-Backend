const { isProduction } = require("./src/auxiliaries/ServerAuxiliaries");
const config = {
  production: {
    databaseConfig:{
      database: process.env.DB_PROD_NAME,
      user:process.env.DB_PROD_USER,
      password:process.env.DB_PROD_PASSWORD,
      options:{
        host: "localhost",
        dialect: "postgres",
        logging: (msg) => logger.silly(msg),
        query: {
          raw: true,
        },
      }
    }
  },
  development: {
    databaseConfig:{
      database: process.env.DB_DEV_NAME,
      user:process.env.DB_DEV_USER,
      password : process.env.DB_DEV_PASSWORD,
      options:{
        host: "192.168.99.100",
        dialect: "postgres",
        logging: false,
        query: {
          raw: true,
        },
      }
    }
  },
};

const roles = Object.freeze({
  ADMIN: "ADMIN",
  BASE: "BASE",
});

module.exports = { 
    config: isProduction ? config.production : config.development, 
    roles }; 
