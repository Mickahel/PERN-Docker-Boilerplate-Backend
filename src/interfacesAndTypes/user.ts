import Sequelize, { Model, Optional } from "sequelize";
export interface User {
	id: string;
	email: string;
	salt: string;
	hash: string;
	firstname: string;
	lastname: string;
	activationCode: string;
	profileImageUrl: string;
	role: string;
	status: string;
	facebookId: string;
	googleId: string;
	language: string;
	theme: string;
	refreshToken: string;
	password?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export interface UserModel extends Sequelize.Instance<User>, Model {
	setPassword: Function;
	setRefreshToken: Function;
}
