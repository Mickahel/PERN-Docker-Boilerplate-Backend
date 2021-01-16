const { DataTypes } = require("sequelize");

const createModel = (database) => {
    const model = database.define("pushNotificationUserToken", {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
    });

    return model;
};

module.exports = createModel;
