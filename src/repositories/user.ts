import _ from "lodash";
import { statuses } from "../enums";
import { getRepository, FindConditions, In, Not, Brackets, FindManyOptions } from "typeorm";
import BaseRepository from "./base";
import User from "../models/userEntity";
// TODO ADD RETURN FUNCTION TYPESCRIPT

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

	getUserByEmail(emails: string[]): Promise<User | undefined> {
		return this.getGeneric({
			email: In(emails),
		});
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

	getUsersByRole(roles: string[]) {
		return database.models.user.findAll({
			where: {
				role: {
					[Sequelize.Op.in]: roles,
				},
			},
		});
	}*/
}
