const { roles } = require("../../config");

const canAdminActOnUser = (modifierUser, targetUser) => {
    if (!modifierUser?.role || !targetUser?.role) return false
    const modifierUserRoleLevel = roles.getPermissionLevelByName(modifierUser.role)
    const targetUserRoleLevel = roles.getPermissionLevelByName(targetUser.role)
    if (modifierUserRoleLevel >= targetUserRoleLevel) return true // TODO REMOVE "="
    return false
}

module.exports = { canAdminActOnUser }