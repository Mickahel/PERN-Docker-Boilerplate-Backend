import ajv from "./AJVInstance";
import { Response, Request, NextFunction } from "express";

const DebugValidator = {
	status: (req: Request, res: Response, next: NextFunction) => {
		const status = req.params.status;
		const schema = {
			type: "integer",
		};
		const valid = ajv.validate(schema, status);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},
};

export default DebugValidator;
