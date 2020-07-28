const { isProduction } = require("./src/auxiliaries/ServerAuxiliaries");
const config = {
  production: {
    logging: {
      databaseLogging: false,
    },
  },
  development: {
    logging: {
      databaseLogging: false,
    },
  },
};

const roles = Object.freeze({
  ADMIN: "ADMIN",
  BASE: "BASE",
});

module.exports = { 
    config: isProduction ? config.production : config.development, 
    roles };
