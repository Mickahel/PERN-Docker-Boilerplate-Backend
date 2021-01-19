const router = require("express").Router();
const UserValidator = require("../../validators/user");
const UserRepository = require("../../repositories/user");
const UserService = require("../../services/user");
const { canAdminActOnUser } = require("../../auxiliaries/permission")
const { publicFolder } = require("../../auxiliaries/server");
const fs = require("fs");
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
 *        schema:
 *          type: object
 *          properties:
 *              firstname:
 *                  type: string
 *                  required: true
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
 *          401:
 *              description: You don't have the permission due to your user role
 */
router.post(
  "/create",
  UserValidator.createUserByAdmin,
  async (req, res, next) => {
    //TODO ADD USER IMAGE - REVISE SWAGGER DOCUMENTATION
    let { user, sendActivationEmail } = req.body;
    if (!canAdminActOnUser(req.user, user)) next({ message: "You don't have the permission due to your user role", status: 401 })
    else {
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
 * /v1/admin/user/edit:
 *    put:
 *      summary: Edit user info
 *      tags: [User]
 *      parameters:
 *      - in: body
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
 *        name: theme
 *      - in: body
 *        name: language
 *      - in: body
 *        name: createdAt
 *      - in: body
 *        name: updatedAt
 *      - in: body
 *        name: password
 *      - in: body
 *        name: role
 *      - in: body
 *        name: removeBackgroundImage
 *        description: if set true, removes the profile image
 *      - in: formData
 *        name: profileImageUrl
 *        type: file
 *        description: The file of the profile image
 *      security:
 *      - cookieAuthAdmin: []
 *      responses:
 *          406:
 *            description: User is not activated / User is disabled
 *          404:
 *            description: User not found
 *          401:
 *            description: You don't have the permission due to your user role
 */
router.put(
  "/edit",
  UserValidator.editUserByAdmin,
  async (req, res, next) => {
    // TODO  REVISE SWAGGER DOCUMENTATION
    const newData = req.body;
    console.log(newData)
    try {
      const userDB = await UserRepository.getUserById(newData.id);
      if (userDB) {
        if (!canAdminActOnUser(req.user, userDB)) next({ message: "You don't have the permission due to your user role", status: 401 })
        else {
          // ? Only Remove old image
          if (newData.removeProfileImageUrl == true) {
            fs.unlink(publicFolder + req.user.profileImageUrl, (err) => {
              if (err) throw err;
            });
            newData.profileImageUrl = null;
          } else if (req.files?.profileImageUrl) {
            // ? Set new image - Remove old image
            if (req.user?.profileImageUrl) {
              fs.unlink(publicFolder + req.user.profileImageUrl, (err) => {
                if (err) throw err;
              });
            }
            newData.profileImageUrl = UserService.uploadProfileImage(req.files?.profileImageUrl)
          }


          const newUser = await UserRepository.updateUser(userDB, newData);
          res.send(newUser);
        }
      } else {
        next({ message: "User not found", status: 404 });
      }
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
