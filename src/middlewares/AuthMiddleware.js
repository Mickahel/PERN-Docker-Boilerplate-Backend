require('dotenv').config()
const jwt = require('jsonwebtoken')
const {roles} = require("../../config")

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;
  if(authorization && authorization.split(' ')[0] === 'Bearer') return authorization.split(' ')[1];
  return null;
};


const authRequired = (role)=>(req,res,next)=>{
  console.log(role)
  let token = getTokenFromHeaders(req)
  if(!token) return res.send({message: "User is not authorized", status: 401})
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, id)=>{

  //TODO
  //*
  //*  in JWT there are: id and role (or only id)
  //*  verify the role and then, if the role is correct, send the user
  //*
  // TODO/
    if(error) return res.send ({message: "Token expired", status: 403})
    req.id = id
    //req.user = user
    next()
  })
}

module.exports = authRequired;
