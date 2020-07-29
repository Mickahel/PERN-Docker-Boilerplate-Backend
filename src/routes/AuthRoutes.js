const passport = require('passport')
const router = require('express').Router();

const Logger = require('../services/Logger')
const logger = new Logger("Auth", "#aeaefe")

/**
 * @swagger
 * /v1/auth/registration:
 *    post:
 *      summary: Registration endpoint
 *      tags: [Auth]
 */
router.post('/signup',  async (req , res, next) => {
  next({message: "not implemented yet"})
})


/**
* @swagger
* /v1/auth/login:
*    post:
*      summary: Login endpoint
*      tags: [Auth]
*/
router.post('/login', (req, res, next) => {
  next({message: "not implemented yet"})
})



/**
 * @swagger
 * /v1/auth/activation/:activationCode:
 *    post:
 *      summary: Activates the user using the activationCode
 *      tags: [Auth]
 */
router.post('/activation/:activationCode', (req, res, next) => {
  next({message: "not implemented yet"})

})


/**
  * @swagger
 * /v1/auth/lost-password-mail:
 *    post:
 *      summary: Send lost password email
 *      tags: [Auth]
 */
router.post('/lost-password-mail', async (req, res, next) => {
  next({message: "not implemented yet"})
})

/**
 * @swagger
 * /v1/auth/password-reset:
 *    post:
 *      summary : Resets the password
 *      tags: [Auth]
 */
router.post('/password-reset', async (req, res, next) => {
  next({message: "not implemented yet"})
})

module.exports = router;
