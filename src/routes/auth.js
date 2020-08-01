const router = require('express').Router();
const passport = require('passport');
const Logger = require('../services/Logger')
const logger = new Logger("Auth Routes", "#aeaefe")
const { sendResetPasswordMail, sendUserActivatedMail, sendNewUserActivationMail } = require('../services/Mailer')
const _ = require('lodash')
const { database } = require('../models')
const UserService = require('../services/User')
const UserRepository = require('../repositories/User')
const AuthValidator = require("../validators/auth")
const jwt = require('jsonwebtoken')

/**
 * @swagger
 * /v1/auth/registration:
 *    post:
 *      summary: Registration endpoint
 *      tags: [Auth]
 *      parameters:
 *      - in: "body"
 *        name: "email"
 *        description: "registration email"
 *        required: true
 *      - in: "body"
 *        name: "password"
 *        description: "password chosen"
 *        required: true
 *      responses:
 *        "409":
 *          description: "User is registered"
 *        "406":
 *          description: "User is not activated / User is deleted"
 */
router.post('/signup', AuthValidator.signup, async (req, res, next) => {
  let { body: user } = req
  try {
    user.email = user.email.trim();
    const isIn = await UserService.isUserRegistrated(user.email);
    if (isIn) next(isIn)
    else {
      let userInDB = await UserRepository.createUser(user)
      //sendNewUserActivationMail(userInDB) //userInDB.datavalues //TODO
      res.status(201).send({ message: "ok" })
    }
  } catch (e) {
    next(e)
  }
})

/**
* @swagger
* /v1/auth/login:
*    post:
*      summary: Login endpoint
*      parameters:
*      - in: "body"
*        name: "email"
*        description: "registration email"
*        required: true
*      - in: "body"
*        name: "password"
*        description: "password chosen"
*        required: true
*      responses:
*        "404":
*          description: "user doesn't exist"
*        "401":
*          description: "user is deleted / user is not activated"
*        "403":
*          description: "email or password is invalid"
*      tags: [Auth]
*/
router.post('/login', AuthValidator.login,  (req, res, next) => {
  let { body: user } = req;
  try {
    user.email = user.email.trim();

    passport.authenticate('local', { session: false }, async(err, passportUser, info) => {
      if (err) return next(err);
        if (!passportUser && info) return next(info)
        else {
          const accessToken   = UserService.generateAccessToken(passportUser.id, passportUser.role)
          const refreshToken  = UserService.generateRefreshToken(passportUser.id, passportUser.role)
          await UserRepository.setRefreshToken(passportUser, refreshToken)
          res.send({
            accessToken,
            refreshToken,
            user: passportUser,
          })
        }
      }
    )(req, res, next)
  } catch (e) {
    next(e)
  }
})

/**
 * @swagger
 * /v1/auth/activation/:activationCode:
 *    post:
 *      summary: Activates the user using the activationCode
 *      tags: [Auth]
 */
router.post('/activation/:activationCode', AuthValidator.activation, async (req, res, next) => {
  const { activationCode } = req.params
  try {
    let user = await UserRepository.getUserByActivationCode(activationCode)
    if (user) {
      user.status = 1
      user.activationCode = null
      user.save()
      //sendUserActivatedMail(user) //TODO
      res.send({ message: "ok" }) 
    } else {
      next({ message: "User not found", status: 404 })
    }
  } catch (e) {
    next(e)
  }
})


/**
  * @swagger
 * /v1/auth/lost-password-mail:
 *    post:
 *      summary: Send lost password email
 *      tags: [Auth]
 */
router.post('/lost-password-mail', AuthValidator.lostPasswordMail, async (req, res, next) => {
  let email = req.body.email.trim()
  try {
    let user = await UserRepository.getUserByMail(email)
    if (user) {
      user.setActivationCode()
      await user.save()
      //sendResetPasswordMail(user.dataValues)  //TODO
      res.send({ message: "ok" })
    } else {
      next({ message: "User not found", status: 404 })
    }
  } catch (e) {
    next(e)
  }
})

/**
 * @swagger
 * /v1/auth/password-reset:
 *    post:
 *      summary : Resets the password
 *      tags: [Auth]
 */
router.post('/password-reset', AuthValidator.passwordReset, async (req, res, next) => {
  const { activationCode, password } = req.body
  try {
    const user = await UserRepository.getUserByActivationCode(activationCode)
    if (user) {
      user.setPassword(password)
      user.activationCode = null
      await user.save()
      res.send({ message: "ok" })
    } else {
      next({ message: "User not found", status: 404 })
    }
  } catch (e) {
    next(e)
  }
})


router.post("/token", async(req,res,next)=>{
  let refreshToken = req.body.token
  let refreshTokenDB= await UserRepository.getRefreshToken(refreshToken)
  if(refreshTokenDB){
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data)=>{
        if(err) return next({message: "Error in RefreshToken", status:403})
        const accessToken = UserService.generateAccessToken(data.id, data.role)
        res.send({accessToken})
    })
  } else next({message: "RefreshToken Not Found", status:403})
})


router.delete("/logout",async (req,res,next)=>{
  let refreshToken = req.body.token
  try{
  let deleted = await UserRepository.deleteRefreshToken(refreshToken)
  if(deleted[0]==1) res.sendStatus(204)
  else next({message: "RefreshToken Not Found", status:403})
  } catch(e){
    next({message: "Error in Logout", status:403})
  }
})


module.exports = router;
