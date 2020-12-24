const { DataTypes } = require("sequelize");

const createModel = (database) => {
  const model = database.define("generalSetting", {
    feature: DataTypes.STRING,
    value: DataTypes.TEXT,
  });

  return model;
};

module.exports = createModel;
