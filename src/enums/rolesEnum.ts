import genericEnum from "./genericEnum";
import { genericEnumInterface, enumObjectType, roleInterface, rolesEnumInterface, singleRoleInterface } from "../interfacesAndTypes/enum";

export default class rolesEnum extends genericEnum implements rolesEnumInterface {
	constructor(enumObject: roleInterface) {
		super(enumObject);
	}

	getPermissionLevelByName(name: string): number {
		for (const role of Object.values(this.values())) if (name == role.name) return role.permissionLevel;
		return Math.min(
			...Object.values(this.values())
				.filter((role) => role.permissionLevel != undefined)
				.map((role) => role.permissionLevel)
		);
	}

	getRoleByName(name: string): null | singleRoleInterface {
		for (const role of Object.values(this.values())) if (name == role.name) return role;
		return null;
	}

	getRoleWithMinimumPermissionLevelByUserType(isAdmin: boolean): singleRoleInterface {
		let permissionLevel = +Infinity;
		let roleChosen: singleRoleInterface = { permissionLevel: +Infinity, name: "", isAdmin: false };
		for (const role of Object.values(this.values())) {
			if (role.permissionLevel < permissionLevel && role.isAdmin == isAdmin) {
				permissionLevel = role.permissionLevel;
				roleChosen = role;
			}
		}
		return roleChosen;
	}

	getAdminRoles(): string[] {
		return Object.values(this.values())
			.filter((role) => role?.isAdmin == true)
			.map((role) => role.name);
	}
}
