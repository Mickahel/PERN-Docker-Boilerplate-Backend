import ajv from "./AJVInstance";
import { Response, Request, NextFunction } from "express";

const FeedbackValidator = {
	createFeedback: (req: Request, res: Response, next: NextFunction) => {
		const data = {
			...req.body,
			...req.files,
		};
		const schema = {
			type: "object",
			required: ["type", "description"],
			properties: {
				type: { enum: ["BUG", "FEATURE"] },
				description: { type: "string" },
				path: { type: "string" },
				screenshot: { type: "object" },
				createdBy: {
					type: "string",
					format: "uuid",
				},
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, data);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	getFeedbackById: (req: Request, res: Response, next: NextFunction) => {
		const feature = req.params.id;
		const schema = {
			type: "string",
			format: "uuid",
		};
		const valid = ajv.validate(schema, feature);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	editFeedback: (req: Request, res: Response, next: NextFunction) => {
		const data = req.body;

		const schema = {
			type: "object",
			required: ["id"],
			properties: {
				id: { type: "string", format: "uuid" },
				type: { enum: ["BUG", "FEATURE"] },
				description: { type: "string" },
				handled: { type: "boolean" },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, data);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},
};

export default FeedbackValidator;
