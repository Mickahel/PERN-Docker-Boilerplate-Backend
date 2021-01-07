const _ = require("lodash");
//const Logger = require("./src/services/Logger");
//const logger = new Logger("Database", "#FF9A00");
const config = {
  base: {
    longTitle: "PERN Boilerplate",
    shortTitle: "PERNB",
    apiDocsLink: "/api-docs",
    mainDomain: "https://app.pernboilerplate.it",
    notificationColor: "#86DAF1",
    contact: {
      name: "Michelangelo De Francesco",
      url: "https://www.linkedin.com/in/michelangelodefrancesco",
      email: "df.michelangelo@gmail.com",
    },
  },
  production: {
    databaseConfig: {
      options: {
        dialect: "postgres",
        //logging: (msg) => logger.silly(msg),
        logging: false,
      },
    },
  },
  development: {
    databaseConfig: {
      options: {
        dialect: "postgres",
        logging: false,
      },
    },
  },
};

function generateEnum(enumObject) {
  for (var key in enumObject) {
    if (enumObject.hasOwnProperty(key)) this[key] = enumObject[key];
  }
  //this.prototype.names = namesFunction(Object.freeze(enumObject)) // ? returns an array
}
generateEnum.prototype.names = function () {
  if (typeof Object.values(this)[0] === "string") return Object.values(this);
  else if (
    typeof Object.values(this)[0] === "object" &&
    Object.values(this)[0].name
  )
    return Object.values(this).map((type) => type.name).filter(type => !_.isEmpty(type));
  return;
};

const roles = new generateEnum({
  SUPERADMIN: { name: "SUPERADMIN", permissionLevel: 2, isAdmin: true },
  ADMIN: { name: "ADMIN", permissionLevel: 1, isAdmin: true },
  BASE: { name: "BASE", permissionLevel: 0, isAdmin: false },
});

roles.getPermissionLevelByName = function (name) {
  for (const role of Object.values(roles))
    if (name == role.name) return role.permissionLevel;
  return Math.min(
    ...Object.values(roles)
      .filter((role) => role.permissionLevel != undefined)
      .map((role) => role.permissionLevel)
  );
};

roles.getRoleByName = function (name) {
  for (const role of Object.values(roles)) if (name == role.name) return role;
  return null;
};
roles.getRoleWithMinimumPermissionLevelByUserType = function (isAdmin) {
  let roleChosen = { permissionLevel: +Infinity };
  for (const role of Object.values(roles)) {
    if (
      role.permissionLevel < roleChosen.permissionLevel && role.isAdmin == isAdmin
    )
      roleChosen = role;
  }
  return roleChosen;
};

roles.getAdminRoles = function () {
  return Object.values(roles).filter(role => role?.isAdmin == true).map(role => role.name)
}

const statuses = new generateEnum({
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  DISABLED: "DISABLED",
});

module.exports = {
  config: {
    ...(process.env.NODE_ENV === "production"
      ? config.production
      : config.development),
    ...config.base,
  },
  roles,
  statuses,
};
