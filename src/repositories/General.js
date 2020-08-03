const { database } = require("../models");
const Sequelize = require("sequelize");
const _ = require("lodash");

class GeneralSettingRepository {


    async getPaginatedResults(model, limit, offset, excludeFields, options) {
        let result = await model.findAll({
            ...options,
            attributes: {
                exclude: excludeFields,
                ...options?.attributes
            },
            offset,
            limit,
            raw: true
        })

        let entitiesInModel = await model.findAndCountAll({
            ...options,
            attributes: {
                exclude: excludeFields,
                ...options?.attributes
            },
        })

        return {
            result,
            length: entitiesInModel.count
        }

    }
}

module.exports = new GeneralSettingRepository()