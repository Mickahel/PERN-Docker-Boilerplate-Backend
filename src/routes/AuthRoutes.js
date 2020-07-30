const router = require('express').Router();
const passport = require('passport');
const Logger = require('../services/Logger')
const logger = new Logger("Auth Routes", "#aeaefe")
const { sendResetPasswordMail, sendUserActivatedMail, sendNewUserActivationMail } = require('../services/Mailer')
const _ = require('lodash')
const { database } = require('../models')
const UserService = require('../services/User')
const UserRepository = require('../repositories/User')

/**
 * @swagger
 * /v1/auth/registration:
 *    post:
 *      summary: Registration endpoint
 *      tags: [Auth]
 */
router.post('/signup', async (req, res, next) => {
  const { body: user } = req
  try {
    user.email = user.email.trim();
    const isIn = await UserService.isUserRegistrated(user.email);
    if (isIn) next(isIn)
    else {
      let userInDB = await UserRepository.createUser(user)
      //sendNewUserActivationMail(userInDB) //userInDB.datavalues //TODO
      res.status(201).send({
        message: "ok"
      })
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
*      tags: [Auth]
*/
router.post('/login', (req, res, next) => {
  const { body: user } = req;
  try {
    user.email = user.email.trim();

    passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      console.log(passportUser)
      if (err) return next(err);
      try {
        if (!passportUser) return next({ status: 401, message: 'Username or password incorrect' })

        const token = passportUser.generateJWT()
        res.send({
          ...token,
          user: passportUser,
        })

      } catch (e) {
        next({ message: 'Internal error' })
      }
    })(req, res, next)
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
router.post('/activation/:activationCode', (req, res, next) => {
  next({ message: "not implemented yet" })

})


/**
  * @swagger
 * /v1/auth/lost-password-mail:
 *    post:
 *      summary: Send lost password email
 *      tags: [Auth]
 */
router.post('/lost-password-mail', async (req, res, next) => {
  next({ message: "not implemented yet" })
})

/**
 * @swagger
 * /v1/auth/password-reset:
 *    post:
 *      summary : Resets the password
 *      tags: [Auth]
 */
router.post('/password-reset', async (req, res, next) => {
  next({ message: "not implemented yet" })
})

module.exports = router;
