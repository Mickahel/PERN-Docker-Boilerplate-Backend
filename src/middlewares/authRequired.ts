import { roles, Troles } from "../enums";
import UserRepository from "../repositories/user";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { singleRoleInterface } from "../interfacesAndTypes/enum";
import isAllowed from "../auxiliaries/permission";

const authRequired = (role?: Troles | singleRoleInterface) => (req: Request, res: Response, next: NextFunction): void => {
	let token = req.cookies.accessToken;
	if (!token) return next({ message: "User is not authorized", status: 401 });
	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET as string,
		async (error: any, user: any): Promise<void> => {
			if (error) return next({ message: "Token expired", status: 403 });
			try {
				// ? Check if the role is right
				const userRepository = new UserRepository();
				let userDB = await userRepository.getById(user.id);
				if (userDB) {
					let isAuthorized = isAllowed(true, userDB.role, role);
					if (isAuthorized) {
						/*if (roles.getRoleByName(userDB.role)?.isAdmin === false) {
							delete userDB.role;
							delete userDB.status;
						}*/
						req.user = userDB;
						next();
					} else next({ message: "User doesn't have right permission", status: 401 });
				} else next({ message: "User doesn't exist", status: 404 });
			} catch (e) {
				next({ message: "Error retrieving user", status: 404 });
			}
		}
	);
};

export default authRequired;
