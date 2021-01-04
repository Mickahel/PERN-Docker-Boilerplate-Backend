const { database } = require("../models");
const Sequelize = require("sequelize");


class PushNotificationUserTokenRepository {

    async registerUserToken(data) {
        let tokenData = await this.findPushToken(data.token)

        if (tokenData) { // ? qui update
            const newUserForToken = await tokenData.update(data)
            return newUserForToken
        } else { // ? non ho trovato il token quindi faccio l'inserimento
            return await database.models.PushNotificationUserToken.create(data)
        }
    }

    async getUserTokens(user) {
        try {
            const userToken = await database.models.PushNotificationUserToken.findAll({
                where: {
                    userId: user.id
                }
            })
            let result = userToken.map(single => single.token)
            return result
        } catch (e) {
            throw e
        }
    }

    async getUsersTokens(users) {
        if (!users) return []

        const ids = users.map(single => single.id)
        try {
            let result = await database.models.PushNotificationUserToken.findAll({
                attributes: ["token"],
                where: {
                    userId: {
                        [Sequelize.Op.in]: ids
                    }
                }
            })

            result = result.map(single => single.token)
            return result;
        } catch (e) {
            throw e
        }
    }

    /*async getUsersTokensByEmail(emails) {
        if (!emails) return []

        try {
            const sql = `SELECT token from userTokens LEFT JOIN users ON users.id = userTokens.userId  WHERE users.email IN (:emails)`
            let result = await database.query(sql, {
                type: Sequelize.QueryTypes.SELECT,
                replacements: { emails }
            })
            result = _.map(result, single => single.token) // si può fare di meglio
            return result;
        } catch (e) {
            throw e
        }
    }*/

    findPushToken(token) {
        return database.models.PushNotificationUserToken.findOne({
            where: {
                token
            }
        })
    }

}

module.exports = new PushNotificationUserTokenRepository();
