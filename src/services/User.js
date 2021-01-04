//const download = require('image-downloader')
const UserRepository = require("../repositories/User");
const jwt = require("jsonwebtoken");
const { statuses } = require("../../config");
const { publicFolder } = require("../auxiliaries/server");
const { v4: uuid } = require("uuid");
const sharp = require("sharp")
const axios = require('axios').default;
class UserService {
  async isUserRegistrated(email) {
    if (!email) return false;
    const user = await UserRepository.getUserByEmail(email);
    if (!user) return false;
    // ? the user is registered
    if (user.status === statuses.ACTIVE)
      return { status: 409, message: "User is already registered" };
    else if (user.status === statuses.PENDING)
      return { status: 406, message: "User is not activated" };
    else if (user.status === statuses.DISABLED)
      return { status: 406, message: "User is disabled" };
    return true
  }

  generateRefreshToken(id) {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
  }

  generateAccessToken(id) {
    return jwt.sign(
      { id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION} days` }
      //{expiresIn:"60s"}
    );
  }

  async uploadProfileImageFromUrl(imageUrl) {
    const imageBuffer = (await axios.get(imageUrl, { responseType: "arraybuffer" })).data;

    // ? Get image type
    const imageSharp = sharp(imageBuffer)
    const type = await imageSharp.metadata().then(({ format }) => format)
    let filename = uuid() + "." + type
    imageSharp.resize(
      {
        width: 300,
        height: 300,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      }).toFile(publicFolder + "uploads/profileImgs/" + filename,
        function (err) {
          if (err) throw err;
        })
    return filename
  }
  uploadProfileImage(imageObject) {
    // ? Set new image
    if (imageObject) {
      let extension =
        "." +
        imageObject.name.split(".")[
        imageObject.name.split(".").length - 1
        ];

      const profileImageUrlName = uuid() + extension;
      if (extension == ".gif") {
        imageObject.mv(
          publicFolder + "uploads/profileImgs/" + profileImageUrlName,
          function (err) {
            if (err) throw err;
          }
        );
      } else {
        sharp(imageObject.data).resize(
          {
            width: 300,
            height: 300,
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          }).toFile(publicFolder + "uploads/profileImgs/" + profileImageUrlName,
            function (err) {
              if (err) {
                throw err;
              }
            })
      }

      return "uploads/profileImgs/" + profileImageUrlName;
    }
  }
}

module.exports = new UserService();