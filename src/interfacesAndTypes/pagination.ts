import { BaseEntity, ObjectType } from "typeorm";

export interface IResultPagination {
	results?: object[];
	pages?: number;
	length?: number;
	previous?: IPaginatedPreviousNext;
	next?: IPaginatedPreviousNext;
}
export interface Imodel {
	entity: ObjectType<BaseEntity>;
	table: string;
}
export interface IPaginatedPreviousNext {
	page: number;
	limit: number;
}
