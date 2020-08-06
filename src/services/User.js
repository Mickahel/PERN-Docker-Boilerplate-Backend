//const download = require('image-downloader')
const UserRepository = require('../repositories/User')
const jwt = require('jsonwebtoken');
const {statuses} = require("../../config")
class UserService {

    async isUserRegistrated(email) {
            if (!email) return false
            const user = await UserRepository.getUserByMail(email)
            if (!user) return false
            // ? the user is registered
            if (user.status     === statuses.ACTIVE)  return { status: 409, message: 'User is registered'     }
            else if(user.status === statuses.PENDING)  return { status: 406, message: 'User is not activated'  }
            else if(user.status === statuses.DISABLED)  return { status: 406, message: 'User is disabled'        }
    }

    generateRefreshToken(id) {
        return jwt.sign({id},process.env.REFRESH_TOKEN_SECRET)
    }

    generateAccessToken(id) {
        return jwt.sign(
          {id},
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn:`${process.env.ACCESS_TOKEN_EXPIRATION} days`}
          //{expiresIn:"60s"}
        );
      };
    


}

module.exports = new UserService()
