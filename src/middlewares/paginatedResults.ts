import BaseRepository from "../repositories/base";
import MiddlewareValidator from "../validators/middlewares";
import { Response, Request, NextFunction } from "express";
import { IResultPagination, Imodel } from "../interfacesAndTypes/pagination";
import { BaseEntity, FindManyOptions, ObjectLiteral } from "typeorm";

const paginatedResults = (repository: ObjectLiteral, options: FindManyOptions<BaseEntity> = {}) => async (req: Request, res: Response, next: NextFunction) => {
	if (req.query.page && req.query.limit) {
		const validationResult = MiddlewareValidator.paginatedResults(req);
		if (validationResult) next(validationResult);
		else {
			const page = parseInt(req.query.page as string);
			const limit = parseInt(req.query.limit as string);

			const startIndex = (page - 1) * limit;

			try {
				const resultsDB = await repository.getAll({
					skip: startIndex,
					take: limit,
					...options,
				});
				const pages = Math.ceil(resultsDB.length / limit);
				let result: IResultPagination = {};

				// ? Check if there is a previous page
				if (startIndex > 0) result.previous = { page: page - 1, limit };

				//? Check if there is a next page
				if (page < pages) result.next = { page: page + 1, limit };

				result.results = resultsDB;
				result.pages = pages;
				result.length = resultsDB.length;

				req.paginatedResults = result;

				next();
			} catch (e) {
				next({ message: "Error with Pagination" });
			}
		}
	} else next();
};

export default paginatedResults;
