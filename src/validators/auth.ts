import ajv from "./AJVInstance";
import { Response, Request, NextFunction } from "express";

const AuthValidator = {
	signup: (req: Request, res: Response, next: NextFunction) => {
		const { body: user } = req;
		const schema = {
			type: "object",
			required: ["email", "password"],
			properties: {
				email: { type: "string", format: "email" },
				password: { type: "string", minLength: 8 },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, user);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	login: (req: Request, res: Response, next: NextFunction) => {
		const { body: user } = req;
		const schema = {
			type: "object",
			required: ["email", "password"],
			properties: {
				email: { type: "string", format: "email" },
				password: { type: "string" },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, user);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	activation: (req: Request, res: Response, next: NextFunction) => {
		const { activationCode } = req.params;
		const schema = {
			type: "string",
			format: "uuid",
		};
		const valid = ajv.validate(schema, activationCode);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	lostPasswordMail: (req: Request, res: Response, next: NextFunction) => {
		const { email } = req.body;
		const schema = {
			type: "string",
			format: "email",
		};
		const valid = ajv.validate(schema, email);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	passwordReset: (req: Request, res: Response, next: NextFunction) => {
		const data = req.body;
		const schema = {
			type: "object",
			required: ["activationCode", "password"],
			properties: {
				activationCode: { type: "string", format: "uuid" },
				password: { type: "string", minLength: 8 },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, data);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},
};

export default AuthValidator;
