const { DataTypes } = require("sequelize");
const { v4: uuid } = require("uuid");

const createModel = (database) => {
    const model = database.define("feedback", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuid(),
        },
        type: DataTypes.ENUM(["BUG", "FEATURE"]),
        description: DataTypes.TEXT,
        screenshotUrl: DataTypes.STRING,
        handled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return model;
};

module.exports = createModel;
