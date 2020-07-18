require('dotenv').config()
const jwt = require('express-jwt')
const {roles} = require("../../config")

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};


const isAdmin = (req, res, next) =>{
    try{
      let role = _.get(req, 'user.role')
      if(!role || role !== roles.ADMIN) throw new HttpException(403, "Only admins")
      next()
    }catch(e){
      next(e)
    }
  }

const auth = {
  required: jwt({
    secret: process.env.SECRET,
    userProperty: 'user',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: process.env.SECRET,
    userProperty: 'user',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
  admin:  jwt({
    secret: process.env.SECRET,
    userProperty: 'user',
    getToken: getTokenFromHeaders,
  }),
};

module.exports = auth;
