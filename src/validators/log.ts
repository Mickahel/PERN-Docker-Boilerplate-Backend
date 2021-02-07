import ajv from "./AJVInstance";
import { Response, Request, NextFunction } from "express";

const LogValidator = {
	getLogs: (req: Request, res: Response, next: NextFunction) => {
		const newData = req.body;
		const schema = {
			type: "object",
			properties: {
				startDate: { type: "string" },
				endDate: { type: "string" },
				additionalProperties: true,
			},
		};
		const valid = ajv.validate(schema, newData);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},
};

export default LogValidator;
