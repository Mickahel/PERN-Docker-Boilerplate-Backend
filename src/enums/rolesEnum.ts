import genericEnum from "./genericEnum";
import { roleInterface, rolesEnumInterface, singleRoleInterface } from "../interfacesAndTypes/enum";
import { Troles } from "./index";
export default class rolesEnum extends genericEnum<singleRoleInterface> implements rolesEnumInterface {
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

	getRoleByName(name: Troles): singleRoleInterface | undefined {
		for (const role of Object.values(this.values())) if (name == role.name) return role;
		return undefined;
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
