import genericEnum from "./genericEnum";
import rolesEnum from "./rolesEnum";

const statuses = new genericEnum({
	ACTIVE: "active",
	PENDING: "pending",
	DISABLED: "disabled",
});

const statusesNames = statuses.names();
type Tstatuses = typeof statusesNames[number];
const themes = new genericEnum({
	LIGHT: "light",
	DARK: "dark",
});
const themesNames = themes.names();
type Tthemes = typeof themesNames[number];

const feedbackTypes = new genericEnum({
	BUG: "bug",
	FEATURE: "feature",
});
const feedbackTypesNames = feedbackTypes.names();
type TfeedbackTypes = typeof feedbackTypesNames[number];

const roles = new rolesEnum({
	SUPERADMIN: { name: "SUPERADMIN", permissionLevel: 2, isAdmin: true },
	ADMIN: { name: "ADMIN", permissionLevel: 1, isAdmin: true },
	BASE: { name: "BASE", permissionLevel: 0, isAdmin: false },
});

const rolesNames = roles.names();
type Troles = typeof rolesNames[number];

export { statuses, Tstatuses, themes, Tthemes, feedbackTypes, TfeedbackTypes, Troles, roles };
