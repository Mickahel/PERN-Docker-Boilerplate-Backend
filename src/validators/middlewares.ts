import ajv from "./AJVInstance";
import { Request } from "express";
// TODO ADD TYPESCRIPT
const MiddlewareValidator = {
	paginatedResults: (req: Request) => {
		const paginationData = req.query.data;
		let data;
		data.page = parseInt(paginationData.page);
		data.limit = parseInt(paginationData.limit);
		const schema = {
			type: "object",
			required: ["page", "limit"],
			properties: {
				page: { type: "number", minimum: 1 },
				limit: { type: "number", minimum: 1 },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, data);

		if (valid) return;
		else return { message: "Validation Error", errors: ajv.errors, status: 400 };
	},
};

export default MiddlewareValidator;