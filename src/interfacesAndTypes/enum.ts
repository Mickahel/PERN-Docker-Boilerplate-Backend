export interface genericEnumInterface {
	names: () => string[];
	values: () => object;
}

export interface singleEnumObjectInterface {
	name: string;
	[x: string]: any;
}

export interface singleStringEnumObjectInterface {
	[key: string]: string;
}
export interface enumObjectInterface {
	[key: string]: singleEnumObjectInterface;
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
	getRoleByName: (name: string) => null | singleRoleInterface;
	getRoleWithMinimumPermissionLevelByUserType: (isAdmin: boolean) => singleRoleInterface;
	getAdminRoles: () => string[];
}

export type enumObjectType = enumObjectInterface | singleStringEnumObjectInterface;
