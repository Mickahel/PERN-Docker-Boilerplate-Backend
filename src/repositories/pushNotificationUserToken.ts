import _ from "lodash";
import { getRepository, In } from "typeorm";
import BaseRepository from "./base";
import PushNotificationUserToken from "../models/pushNotificationUserTokenEntity";
import User from "../models/userEntity";
export default class PushNotificationUserTokenRepository extends BaseRepository<PushNotificationUserToken> {
	constructor() {
		super(PushNotificationUserToken, "pushNotificationUserToken");
	}
	async getUsersTokens(users: User[]) {
		const ids = users.map((single) => single.id);
		console.log(ids);
		try {
			const Tokens = await this.getAll({
				where: {
					user: In(ids),
				},
			});
			/*		let result = await database.models.pushNotificationUserToken.findAll({
				attributes: ["token"],
				where: {
					userId: {
						[Sequelize.Op.in]: ids,
					},
				},
			});
*/
			const result = Tokens.map((single) => single.token);
			return result;
		} catch (e) {
			throw e;
		}
	}
	/*async registerUserToken(data) {
		let tokenData = await this.findPushToken(data.token);
		if (tokenData) {
			// ? qui update
			const newUserForToken = await tokenData.update(data);
			return newUserForToken;
		} else {
			// ? non ho trovato il token quindi faccio l'inserimento
			return await database.models.pushNotificationUserToken.create(data);
		}
	}

	async getUserTokens(user) {
		try {
			const userToken = await database.models.pushNotificationUserToken.findAll({
				where: {
					userId: user.id,
				},
			});
			let result = userToken.map((single) => single.token);
			return result;
		} catch (e) {
			throw e;
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
    }

	findPushToken(token) {
		return database.models.pushNotificationUserToken.findOne({
			where: {
				token,
			},
		});
	}*/
}
