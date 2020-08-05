const { isProduction } = require("./src/auxiliaries/ServerAuxiliaries");
const config = {
  base:{
    title:"PERN Boilerplate",
    date:"a PERN boilerplate",
    apiDocsLink: "/api-docs",
    contact: {
      name: "Michelangelo De Francesco",
      url: "https://www.linkedin.com/in/michelangelodefrancesco",
      email: "df.michelangelo@gmail.com",
    },
  },
  production: {
    databaseConfig:{
      database: process.env.DB_PROD_NAME,
      user:process.env.DB_PROD_USER,
      password:process.env.DB_PROD_PASSWORD,
      options:{
        host: "localhost",
        dialect: "postgres",
        logging: (msg) => logger.silly(msg),
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
      }
    }
  },
};
  

const roles = Object.freeze({
  SUPERADMIN: {name: "SUPERADMIN",  permissionLevel: 2},
  ADMIN:      {name: "ADMIN",       permissionLevel: 1},
  BASE:       {name: "BASE",        permissionLevel: 0}
});

const statuses  = Object.freeze({
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  DISABLED: "DISABLED"
});

module.exports = { 
    config: {
      ...(isProduction ? config.production : config.development),
      ...config.base
    }, 
    roles,
    statuses
  }; 
