import { roles } from "../../config";

export default function canAdminActOnUser(modifierUser, targetUser): Boolean {
	// TODO Add types
	if (!modifierUser?.role || !targetUser?.role) return false;
	const modifierUserRoleLevel = roles.getPermissionLevelByName(modifierUser.role);
	const targetUserRoleLevel = roles.getPermissionLevelByName(targetUser.role);
	if (modifierUserRoleLevel >= targetUserRoleLevel) return true; // TODO REMOVE "="
	return false;
}
