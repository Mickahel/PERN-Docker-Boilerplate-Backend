
const  Sequelize = require('sequelize');
const { isProduction } = require("../auxiliaries/ServerAuxiliaries");
const Logger = require("../services/Logger");
const logger = new Logger("Database", "bgYellowBright");
const createDataModel = require("./dataModel")
const config = require('../../config.json');

const databaseCredentials = {
  database: isProduction ? process.env.DB_PROD_NAME : process.env.DB_TEST_NAME,
  user: isProduction ? process.env.DB_PROD_USER : process.env.DB_TEST_USER,
  password: isProduction
    ? process.env.DB_PROD_PASSWORD
    : process.env.DB_TEST_PASSWORD,
  options: {
    host: isProduction ? "localhost" : "192.168.99.100",
    dialect: "postgres",
    logging: config.databaseLogging ? (msg) => logger.silly(msg) : false,
  },
};

let models = {}
const initializeDatabase = () => {
  const database = new Sequelize(
    databaseCredentials.database,
    databaseCredentials.user,
    databaseCredentials.password,
    databaseCredentials.options
  );

  
models = {
  dataModel: createDataModel(database)
};

  database.authenticate().then((response)=>{    
    logger.info("Connection to database has been established successfully.");
  }).catch((error)=>{
    logger.error("Unable to connect to the database:", error)})
  

    Object.keys(models).forEach((modelName) => {
      if ("associate" in models[modelName]) {
        models[modelName].associate(models);
      }
    });

    models.sequelize = database;
    models.Sequelize = Sequelize;
    if(isProduction){
      database.sync({ alter: true }).then((response)=>{
        logger.info("Synchronized successfully")
      })
    }

};

module.exports = {models, initializeDatabase};
