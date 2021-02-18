export interface IResultPagination {
	results?: object[];
	pages?: number;
	length?: number;
	previous?: paginatedPreviousNext;
	next?: paginatedPreviousNext;
}

interface paginatedPreviousNext {
	page: number;
	limit: number;
}
