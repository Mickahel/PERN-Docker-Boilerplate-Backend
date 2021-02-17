export interface ILogs {
	keep?: string | number;
	logs: string[];
	startDate?: string;
	endDate?: string;
}

export interface ISingleLogFile {
	date: number;
	name: string;
	hash: string;
}
