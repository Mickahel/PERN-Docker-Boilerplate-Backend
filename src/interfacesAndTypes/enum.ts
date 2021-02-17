import { Troles } from "../enums";
export interface IGenericEnumClass {
	names: () => string[];
	values: () => object;
}

export interface singleEnumObjectInterface {
	name: string;
	[key: string]: any;
}

export interface singleStringEnumObjectInterface {
	[key: string]: string;
}
export interface enumObjectInterface {
	[key: string]: singleEnumObjectInterface;
}

export interface IGenericEnum<T> {
	[key: string]: T;
}
export interface singleRoleInterface extends singleEnumObjectInterface {
	name: string;
	permissionLevel: number;
	isAdmin: boolean;
}

export interface roleInterface {
	[key: string]: singleRoleInterface;
}

export interface rolesEnumInterface extends genericEnumInterface {
	getPermissionLevelByName: (name: string) => number;
	getRoleByName: (name: Troles) => singleRoleInterface | undefined;
	getRoleWithMinimumPermissionLevelByUserType: (isAdmin: boolean) => singleRoleInterface;
	getAdminRoles: () => string[];
}
