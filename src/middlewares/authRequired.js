require("dotenv").config();
const jwt = require("jsonwebtoken");
const { roles } = require("../../config");
const UserRepository = require("../repositories/User");

const getTokenFromCookie = (req) => {
  return req.cookies.accessToken;
};

const authRequired = (role) => (req, res, next) => {
  let token = getTokenFromCookie(req);
  if (!token) return next({ message: "User is not authorized", status: 401 });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
    if (error) return next({ message: "Token expired", status: 403 });
    try {
      // ? Check if the role is right
      let userDB = await UserRepository.getUserById(user.id);
      //console.log(userDB)
      if (userDB) {
        let isAuthorized = isAllowed(userDB.role, role);
        if (isAuthorized) {
          if (roles.getRoleByName(userDB.role)?.isAdmin === false) {
            delete userDB.dataValues.role;
            delete userDB.dataValues.status;
          }
          req.user = userDB;
          next();
        } else
          next({ message: "User doesn't have right permission", status: 401 });
      } else next({ message: "User doesn't exist", status: 404 });
    } catch (e) {
      next({ message: "Error retrieving user", status: 404 });
    }
  });
};

const isAllowed = (userRole, role) => {
  // ? Get permission Level of the user
  if (!role) role = roles.getRoleWithMinimumPermissionLevelByUserType(false);
  else if (typeof role === "string") role = roles.getRoleByName(role);
  const userRoleFromEnum = roles.getRoleByName(userRole);
  if (userRoleFromEnum.permissionLevel >= role.permissionLevel) return true;
  return false;
};

module.exports = authRequired;
