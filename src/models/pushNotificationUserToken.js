const { DataTypes } = require("sequelize");

const createModel = (database) => {
    const model = database.define("PushNotificationUserToken", {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
    });

    return model;
};

module.exports = createModel;
