import { roles, Troles } from "../enums";
import { singleRoleInterface } from "../interfacesAndTypes/enum";
import User from "../models/userEntity";

export function canAdminActOnUser(modifierUser: User, targetUser: User): Boolean {
	if (!modifierUser?.role || !targetUser?.role) return false;
	return isAllowed(false, modifierUser.role, targetUser.role);
}
export default function isAllowed(isSameLevelRolePermitted: boolean, userRole: Troles, role?: Troles | singleRoleInterface) {
	// ? Get permission Level of the user
	let roleChosen: singleRoleInterface | undefined;
	if (!role) roleChosen = roles.getRoleWithMinimumPermissionLevelByUserType(false);
	else if (typeof role === "string") roleChosen = roles.getRoleByName(role);
	else roleChosen = role;
	const userRoleFromEnum = roles.getRoleByName(userRole);
	if (userRoleFromEnum !== undefined && roleChosen !== undefined) {
		let comparisonValue: boolean = isSameLevelRolePermitted === true ? userRoleFromEnum.permissionLevel >= roleChosen.permissionLevel : userRoleFromEnum.permissionLevel > roleChosen.permissionLevel;
		return comparisonValue;
	}
	return false;
}
