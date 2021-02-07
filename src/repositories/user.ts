import { database } from "../models";
import Sequelize from "sequelize";
import _ from "lodash";
import { statuses } from "../enums";
import { UserModel, User } from "../interfacesAndTypes/user";
// TODO ADD RETURN FUNCTION TYPESCRIPT
class UserRepository {
	getTotal() {
		return database.models.user.count({
			group: ["status"],
		});
	}

	getUserList(includeDisabledUsers: boolean = false) {
		if (includeDisabledUsers) {
			return database.models.user.findAll({});
		} else {
			return database.models.user.findAll({
				where: {
					status: { [Sequelize.Op.not]: statuses.values().DISABLED },
				},
			});
		}
	}

	getUserByEmail(email: string) {
		return database.models.user.findOne({
			where: {
				email,
			},
		});
	}

	getUserById(id: string) {
		return database.models.user.findOne({
			where: {
				id,
			},
		});
	}

	getUserByEmails(emails: string[]) {
		return database.models.user.findOne({
			where: {
				email: {
					[Sequelize.Op.in]: emails,
				},
			},
		});
	}

	getUserByFacebookId(facebookId: string) {
		return database.models.user.findOne({
			where: {
				facebookId,
			},
		});
	}

	getUserByGoogleId(googleId: string) {
		return database.models.user.findOne({
			where: {
				googleId,
			},
		});
	}

	getUserByActivationCode(activationCode: string) {
		return database.models.user.findOne({
			where: {
				activationCode,
			},
		});
	}

	getRefreshToken(refreshToken: string) {
		return database.models.user.findOne({
			attributes: ["refreshToken"],
			where: {
				refreshToken,
			},
		});
	}

	async createUser(user: User, generateActivationCode: boolean = true) {
		const newUser = database.models.user.build(user);
		if (user.password) newUser.setPassword(user.password);
		if (generateActivationCode) newUser.setActivationCode();
		return await newUser.save();
	}

	async updateUser(user: UserModel, newData: User) {
		if (newData.password) {
			user.setPassword(newData.password);
			await user.save();
		}
		return await user.update(newData);
	}
	async setRefreshToken(user: UserModel, refreshToken: string) {
		user.setRefreshToken(refreshToken);
		await user.save();
	}

	deleteRefreshToken(refreshToken: string) {
		return database.models.user.update(
			{
				refreshToken: null,
			},
			{
				where: {
					refreshToken,
				},
			}
		);
	}

	disableUser(user: UserModel) {
		user.status = statuses.values().DISABLED as string;
		return user.save();
	}

	getUsersByRole(roles: string[]) {
		return database.models.user.findAll({
			where: {
				role: {
					[Sequelize.Op.in]: roles,
				},
			},
		});
	}
}

export default new UserRepository();
