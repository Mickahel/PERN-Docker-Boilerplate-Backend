import ajv from "./AJVInstance";
import { Request } from "express";
import { IPaginatedPreviousNext } from "../interfacesAndTypes/pagination";
const MiddlewareValidator = {
	paginatedResults: (req: Request) => {
		const paginationData = req.query as { page: string; limit: string };
		let data: IPaginatedPreviousNext = {
			page: parseInt(paginationData.page),
			limit: parseInt(paginationData.limit),
		};
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
