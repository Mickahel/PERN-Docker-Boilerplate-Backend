import _ from "lodash";
import { getRepository, In } from "typeorm";
import BaseRepository from "./base";
import User from "../models/userEntity";

export default class UserRepository extends BaseRepository<User> {
	constructor() {
		super(User, "user");
	}

	createUser(user: User, generateActivationCode = true): Promise<User> {
		const newUser = getRepository(this._type).create(user);
		if (user.password) newUser.setPassword(user.password);
		if (generateActivationCode) newUser.setActivationCode();
		return newUser.save();
	}

	getUserByEmails(emails: string[]): Promise<User | undefined> {
		return this.getGeneric({
			email: In(emails),
		});
	}

	getUsersByRole(roles: string[]) {
		return this.getAll({ where: { role: In(roles) } });
	}

	/*getUserList(includeDisabledUsers: boolean = false) {
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

	async createUser(user: User, generateActivationCode: boolean = true) {
		const newUser = database.models.user.build(user);
		if (user.password) newUser.setPassword(user.password);
		if (generateActivationCode) newUser.setActivationCode();
		return await newUser.save();
	}
User
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

	disableUser(user: UserModel) {
		user.status = statuses.values().DISABLED as string;
		return user.save();
	}

*/
}
