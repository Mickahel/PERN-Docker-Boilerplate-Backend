require('dotenv').config()
const jwt = require('jsonwebtoken')
const { roles } = require("../../config")
const UserRepository = require("../repositories/User")

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;
  if (authorization && authorization.split(' ')[0] === 'Bearer') return authorization.split(' ')[1];
  return null;
};


const authRequired = (role) => (req, res, next) => {
  let token = getTokenFromHeaders(req)
  if (!token) return next({ message: "User is not authorized", status: 401 })
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
    if (error) return next({ message: "Token expired", status: 403 })
    try {
      // ? Check if the role is right
      let isAuthorized = checkRole(user.role, role)
      if (isAuthorized) {
        let userDB = await UserRepository.getById(user.id)
        if (userDB.role === roles.BASE.name) {
          delete userDB.dataValues.role
          delete userDB.dataValues.status
        }
        req.user = userDB
        next()
      } else next({ message: "User doesn\'t have right permission", status: 401 })
    } catch (e) {
      next({ message: "Error retrieving user" })
    }
  })
}


const checkRole = (userRole, role) => {
  // ? Get permission Level of the user
  if (!role) role = { permissionLevel: 0 }
  else if (typeof role === "string") role = Object.values(roles).find(enumRole => role.toLowerCase() == enumRole.name.toLowerCase())
  const userPermissionLevel = Object.values(roles).find(enumRole => userRole == enumRole.name)
  if (userPermissionLevel.permissionLevel >= role.permissionLevel) return true
  else return false
}

module.exports = authRequired;
