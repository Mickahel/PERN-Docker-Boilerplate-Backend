require("./pg-EnumFix");
const Sequelize = require("sequelize");
const { isProduction } = require("../auxiliaries/ServerAuxiliaries");
const Logger = require("../services/Logger");
const logger = new Logger("Database", "bgYellowBright");
const createUserModel = require("./User");
const { config } = require("../../config");

const databaseCredentials = {
  database: isProduction ? process.env.DB_PROD_NAME : process.env.DB_TEST_NAME,
  user: isProduction ? process.env.DB_PROD_USER : process.env.DB_TEST_USER,
  password: isProduction
    ? process.env.DB_PROD_PASSWORD
    : process.env.DB_TEST_PASSWORD,
  options: {
    host: isProduction ? "localhost" : "192.168.99.100",
    dialect: "postgres",
    query: {
      raw: true,
    },
    logging: config.logging.databaseLogging
      ? (msg) => logger.silly(msg)
      : false,
  },
};

const database = new Sequelize(
  databaseCredentials.database,
  databaseCredentials.user,
  databaseCredentials.password,
  databaseCredentials.options
);
const initializeDatabase = async () => {
  try {
    logger.info("Connecting to database");
    await database.authenticate();
    logger.info("Connection to database has been established successfully.");

    //--------- Model initialization ------
    const User = createUserModel(database);

    if (!isProduction) {
      await database.sync({ alter: true });
      logger.info("Database synchronized successfully");
    }

    /*else {
      database.sync().then((response)=>{
        logger.info("Database synchronized successfully")
      }) 
    }*/
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    logger.error("Closing app")
    process.exit(1)
  }
};

module.exports = { database, initializeDatabase };
