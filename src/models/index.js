require("./pg-EnumFix");
const Sequelize = require("sequelize");
const { isProduction } = require("../auxiliaries/server");
const { config } = require("../../config");
const Logger = require("../services/logger");
const logger = new Logger("Database", "#FF9A00");

const createUserModel = require("./user");
const createGeneralSettingModel = require("./generalSetting");
const createPushNotificationUserToken = require("./pushNotificationUserToken")
const createFeedbackModel = require("./feedback")

const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    ...config.databaseConfig.options
  }
);
const initializeDatabase = async () => {
  try {
    logger.info("Connecting to database");
    await database.authenticate();
    logger.info("Connection to database has been established successfully.");

    // ? --------- Model initialization ---------
    const User = createUserModel(database);
    const GeneralSetting = createGeneralSettingModel(database);
    const PushNotificationUserToken = createPushNotificationUserToken(database)
    const Feedback = createFeedbackModel(database)
    
    // ? --------- Relationships ---------
    // ? One To Many relationship between user and push notification tokens
    User.hasMany(PushNotificationUserToken, {
      foreignKey: 'userId',
      as: 'userId'
    });
    PushNotificationUserToken.belongsTo(User,{foreignKey: 'userId'});

    // ? One To Many relationship between user and push notification tokens
    User.hasMany(Feedback, {
      foreignKey: 'createdBy',
      as: 'createdBy'
    });
    Feedback.belongsTo(User,{foreignKey: 'createdBy'});

    if (!isProduction) await database.sync({ alter: true });
    else await database.sync();

    logger.info("Database synchronized successfully");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    logger.error("Closing app");
    process.exit(1);
  }
};

module.exports = { database, initializeDatabase };
