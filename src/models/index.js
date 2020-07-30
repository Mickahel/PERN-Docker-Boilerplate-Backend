require("./pg-EnumFix");
const Sequelize = require("sequelize");
const { isProduction } = require("../auxiliaries/ServerAuxiliaries");
const Logger = require("../services/Logger");
const logger = new Logger("Database", "bgYellowBright");
const createUserModel = require("./User");
const { config } = require("../../config");



const database = new Sequelize(
  config.databaseConfig.database,
  config.databaseConfig.user,
  config.databaseConfig.password,
  config.databaseConfig.options
);  
const initializeDatabase = async () => {
  try {
    logger.info("Connecting to database");
    await database.authenticate();
    logger.info("Connection to database has been established successfully.");

    // ? --------- Model initialization ------
    const User = createUserModel(database);

    if (!isProduction) await database.sync({ alter: true}); 
    else await database.sync();
    
    logger.info("Database synchronized successfully");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    logger.error("Closing app")
    process.exit(1)  
  }
};

module.exports = { database, initializeDatabase };
