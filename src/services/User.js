//const download = require('image-downloader')
const UserRepository = require('../repositories/User')
const _ = require('lodash')
const path = require('path')
const jwt = require('jsonwebtoken');

const UserService = class UserService {

    async isUserRegistrated(email) {
            if (!email) return false
            const user = await UserRepository.getUserByMail(email)
            if (!user) return false
            // ? the user is registered
            if (user.status     === 1)  return { status: 409, message: 'User is registered'     }
            else if(user.status === 0)  return { status: 406, message: 'User is not activated'  }
            else if(user.status ===-1)  return { status: 406, message: 'User is deleted'        }
    }

    generateRefreshToken(id,role) {
        return jwt.sign({id, role},process.env.REFRESH_TOKEN_SECRET)
    }

    generateAccessToken(id, role) {
        return jwt.sign(
          {id, role},
          process.env.ACCESS_TOKEN_SECRET,
          //{expiresIn:"60s"}
        );
      };
    


}

module.exports = new UserService()
