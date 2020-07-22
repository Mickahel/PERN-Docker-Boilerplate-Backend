const router = require('express').Router();
/**
 * @swagger
 * /v1/auth/registration:
 *    post:
 *      description: Registration endpoint
 *      tags: [Auth]
 */
router.post('/signup',  async (req , res, next) => {

})


/**
* @swagger
* /v1/auth/login:
*    post:
*      description: Login endpoint
*      tags: [Auth]
*/
router.post('/login', (req, res, next) => {

})



/**
 * @swagger
 * /v1/auth/activation/:activationCode:
 *    post:
 *      description: Activates the user using the activationCode
 *      tags: [Auth]
 */
router.post('/activation/:activationCode', (req, res, next) => {


})


/**
  * @swagger
 * /v1/auth/lost-password-mail:
 *    post:
 *      description: Send lost password email
 *      tags: [Auth]
 */
router.post('/lost-password-mail', async (req, res, next) => {

})

/**
 * @swagger
 * /v1/auth/password-reset:
 *    post:
 *      description: Resets the password
 *      tags: [Auth]
 */
router.post('/password-reset', async (req, res, next) => {

})

module.exports = router;
