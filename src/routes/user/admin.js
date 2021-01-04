const router = require("express").Router();
const UserValidator = require("../../validators/user");
const UserRepository = require("../../repositories/User");
const UserService = require("../../services/User");

/**
 * @swagger
 * /v1/admin/user/info/all:
 *    get:
 *      summary: get all users information
 *      tags: [User]
 *      security:
 *      - cookieAuthAdmin: []
 *      responses:
 *          404:
 *              description: User not found
 */
router.get("/info/all", async (req, res, next) => {
  try {
    const usersDB = await UserRepository.getUserList(true);
    if (usersDB) {
      res.send(usersDB);
    } else {
      next({ message: "Users not found", status: 404 });
    }
  } catch (e) {
    next(e);
  }
});

/**
 * @swagger
 * /v1/admin/user/create:
 *    post:
 *      summary: Creates new user
 *      tags: [User]
 *      parameters:
 *      - in: body
 *        name: user
 *        description: user details. Email Required
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *              firstname:
 *                  type: string
 *              lastname:
 *                  type: string
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *              status:
 *                  type: string
 *              role:
 *                  type: string
 *      - in: body
 *        name: sendActivationEmail
 *        description: Send Activation Email
 *      - in: formData
 *        name: profileImage
 *        type: file
 *        description: The file of the profile image
 *      security:
 *      - cookieAuthAdmin: []
 *      responses:
 *          409:
 *              description: User is already registered
 *          406:
 *              description: User is not activated / User is disabled
 */
router.post(
  "/create",
  UserValidator.createUserByAdmin,
  async (req, res, next) => {
    //TODO ADD USER IMAGE - REVISE SWAGGER DOCUMENTATION
    let { user, sendActivationEmail } = req.body;
    try {
      user.email = user.email.trim();
      const isIn = await UserService.isUserRegistrated(user.email);
      if (isIn !== false) next(isIn);
      else {
        let userInDB = await UserRepository.createUser(
          user,
          sendActivationEmail
        );
        if (sendActivationEmail) sendNewUserActivationMail(userInDB.dataValues);
        if (!user.password) sendNewUserSetPasswordMail(userInDB.dataValues);
        res.status(201).send(userInDB);
      }
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @swagger
 * /v1/admin/user/info/:id:
 *    get:
 *      summary: get user information
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *        description: id of the user
 *        required: true
 *      security:
 *          - cookieAuthAdmin: []
 *      responses:
 *        404:
 *          description: User not found
 */
router.get("/info/:id", UserValidator.getUserById, async (req, res, next) => {
  try {
    const userDB = await UserRepository.getUserById(req.params.id);
    if (userDB) {
      res.send(userDB);
    } else {
      next({ message: "User not found", status: 404 });
    }
  } catch (e) {
    next(e);
  }
});

/**
 * @swagger
 * /v1/admin/user/edit/:id:
 *    put:
 *      summary: Edit user info
 *      tags: [User]
 *      parameters:
 *      - in: path
 *        name: id
 *        description: id of the user
 *        required: true
 *      - in: body
 *        name: firstname
 *      - in: body
 *        name: lastname
 *      - in: body
 *        name: email
 *      - in: body
 *        name: password
 *      - in: body
 *        name: status
 *      - in: body
 *        name: role
 *      security:
 *      - cookieAuthAdmin: []
 *      responses:
 *          406:
 *              description: User is not activated / User is disabled
 *          404:
 *            description: User notfound
 */
router.put(
  "/edit/:id",
  UserValidator.editUserByAdmin,
  async (req, res, next) => {
    //TODO ADD USER IMAGE - REVISE SWAGGER DOCUMENTATION
    try {
      const userDB = await UserRepository.getUserById(req.params.id);
      if (userDB) {
        const newUser = await UserRepository.updateUser(userDB, req.body);
        res.send(newUser);
      } else {
        next({ message: "User not found", status: 404 });
      }
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
