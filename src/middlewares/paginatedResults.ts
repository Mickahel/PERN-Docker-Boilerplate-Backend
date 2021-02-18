import BaseRepository from "../repositories/base";
import MiddlewareValidator from "../validators/middlewares";
import { Response, Request, NextFunction } from "express";
import { IResultPagination } from "../interfacesAndTypes/pagination";
// TODO NEEDS REFACTOR
const paginatedResults = (model, excludeFields, options) => async (req: Request, res: Response, next: NextFunction) => {
	const validationResult = MiddlewareValidator.paginatedResults(req);
	if (validationResult) next(validationResult);
	else {
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);

		const startIndex = (page - 1) * limit;

		try {
			const modelRepository = new BaseRepository(model.entity, model.table);
			const resultsDB = await modelRepository.getPaginatedResults(limit, startIndex, excludeFields, options);

			const pages = Math.ceil(resultsDB.length / limit);
			let result: IResultPagination = {};

			// ? Check if there is a previous page
			if (startIndex > 0) result.previous = { page: page - 1, limit };

			//? Check if there is a next page
			if (page < pages) result.next = { page: page + 1, limit };

			result.results = resultsDB.result;
			result.pages = pages;
			result.length = resultsDB.length;

			req.paginatedResults = result;
			next();
		} catch (e) {
			next({ message: "Error with Pagination" });
		}
	}
};

module.exports = paginatedResults;
