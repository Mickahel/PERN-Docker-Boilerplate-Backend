import ajv from "./AJVInstance";
import { Response, Request, NextFunction } from "express";

import { roles, statuses } from "../enums";

const UserValidator = {
	editUser: (req: Request, res: Response, next: NextFunction) => {
		const newData = {
			...req.body,
			...req.files,
		};
		const schema = {
			type: "object",
			properties: {
				firstname: { type: "string" },
				lastname: { type: "string" },
				email: { type: "string", format: "email" },
				language: { type: "string" },
				removeProfileImageUrl: { type: "boolean" },
				theme: { enum: ["light", "dark"] },
				profileImageUrl: { type: "object" },
			},
			additionalProperties: true,
		};
		const valid = ajv.validate(schema, newData);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	resetPassword: (req: Request, res: Response, next: NextFunction) => {
		const schema = {
			type: "object",
			properties: {
				currentPassword: { type: "string" },
				password: { type: "string" },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, req.body);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	editUserByAdmin: (req: Request, res: Response, next: NextFunction) => {
		const newData = req.body;
		const schema = {
			type: "object",
			required: ["id"],
			properties: {
				id: { type: "string", format: "uuid" },
				firstname: { type: "string" },
				lastname: { type: "string" },
				facebookId: { type: "string" },
				googleId: { type: "string" },
				updatedAt: { type: "string" },
				createdAt: { type: "string" },
				theme: { enum: ["light", "dark"] },
				language: { type: "string" },
				password: { type: "string" },
				email: { type: "string", format: "email" },
				profileImageUrl: { type: "string" },
				removeProfileImageUrl: { type: "boolean" },
				status: { enum: statuses.names() },
				role: { enum: roles.names() },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, newData);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	getUserById: (req: Request, res: Response, next: NextFunction) => {
		const schema = {
			type: "string",
			format: "uuid",
		};
		const valid = ajv.validate(schema, req.params.id);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	impersonificate: (req: Request, res: Response, next: NextFunction) => {
		const schema = {
			type: "string",
			format: "uuid",
		};
		const valid = ajv.validate(schema, req.params.id);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	sendActivationEmail: (req: Request, res: Response, next: NextFunction) => {
		const schema = {
			type: "string",
			format: "uuid",
		};
		const valid = ajv.validate(schema, req.params.id);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	sendPasswordRemindEmail: (req: Request, res: Response, next: NextFunction) => {
		const schema = {
			type: "string",
			format: "uuid",
		};
		const valid = ajv.validate(schema, req.params.id);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	createUserByAdmin: (req: Request, res: Response, next: NextFunction) => {
		const schema = {
			type: "object",
			required: ["email"],
			properties: {
				firstname: { type: "string" },
				lastname: { type: "string" },
				email: { type: "string", format: "email" },
				password: { type: "string" },
				status: { enum: statuses.names() },
				role: { enum: roles.names() },
				language: { type: "string" },
				theme: { enum: ["light", "dark"] },
				sendActivationEmail: { type: "boolean" },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, req.body);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},
};

export default UserValidator;
