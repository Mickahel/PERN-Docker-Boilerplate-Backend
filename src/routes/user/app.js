const router = require("express").Router();
const UserValidator = require("../../validators/user");
const UserRepository = require("../../repositories/user");
const { publicFolder } = require("../../auxiliaries/server");
const fs = require("fs");
const Logger = require("../../services/logger");
const logger = new Logger("User API", "#9F9A00");
const UserService = require("../../services/user")
/**
 * @swagger
 * /v1/app/user/info:
 *    get:
 *      summary: get user information
 *      tags: [User]
 *      security:
 *          - cookieAuthBasic: []
 */
router.get("/info", (req, res, next) => {
  res.send(req.user);
});

/**
 * @swagger
 * /v1/app/user/edit:
 *    put:
 *      summary: edit user information
 *      tags: [User]
 *      security:
 *          - cookieAuthBasic: []
 *      parameters:
 *      - in: body
 *        name: email
 *        description: new email
 *      - in: body
 *        name: firstname
 *        description: new firstname
 *      - in: body
 *        name: lastname
 *        description: new lastname
 *      - in: body
 *        name: removeProfileImageUrl
 *        description: if set true, removes the profile image
 *      - in: formData
 *        name: profileImageUrl
 *        type: file
 *        description: The file of the profile image
 */
router.put("/edit", async (req, res, next) => {
  const newData = req.body;

  try {
    // ? Only Remove old image
    if (Boolean(newData.removeProfileImageUrl) == true) {
      fs.unlink(publicFolder + req.user.profileImageUrl, (err) => {
        if (err) throw err;
      });
      newData.profileImageUrl = null;
    } else {
      // ? Set new image - Remove old image
      if (req.user?.profileImageUrl) {
        fs.unlink(publicFolder + req.user.profileImageUrl, (err) => {
          if (err) throw err;
        });
      }
      newData.profileImageUrl = UserService.uploadProfileImage(req.files?.profileImageUrl)
    }
    const newUser = await UserRepository.updateUser(req.user, newData);
    res.send(newUser);
  } catch (e) {
    next(e);
  }
});

/**
 * @swagger
 * /v1/app/user/reset-password:
 *    put:
 *      summary: reset password
 *      tags: [User]
 *      security:
 *          - cookieAuthBasic: []
 *      parameters:
 *      - in: body
 *        name: email
 *        description: new email
 *      - in: body
 *        name: firstname
 */
router.put(
  "/reset-password",
  UserValidator.resetPassword,
  async (req, res, next) => {
    try {
      if (req.user.validatePassword(req.body.currentPassword)) {
        await UserRepository.updateUser(req.user, {
          password: req.body.password,
        });
        res.send({ message: "ok" });
      } else {
        next({ message: "Current Password is Wrong", status: 401 });
      }
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @swagger
 * /v1/app/user/disable:
 *    delete:
 *      summary: Disable user
 *      tags: [User]
 *      parameters:
 *      - in: body
 *        name: email
 *        description: email
 *      security:
 *          - cookieAuthBasic: []
 *      responses:
 *        401:
 *          description: Password is wrong
 */
router.delete("/disable", async (req, res, next) => {
  // ? Check password
  if (req.user.validatePassword(req.body.password)) {
    UserRepository.disableUser(req.user)
    res.status(204).send()
  }
  else next({ message: "Password is wrong", status: 401 });
})

module.exports = router;
