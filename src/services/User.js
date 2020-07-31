//const download = require('image-downloader')
const UserRepository = require('../repositories/User')
const _ = require('lodash')
const path = require('path')

const UserService = class UserService {

    async isUserRegistrated(email) {
            if (!email) return false
            const user = await UserRepository.getUserByMail(email)
            if (!user) return false
            // ? the user is registered
            if (user.status === 1)      return { status: 409, message: 'User is registered'     }
            else if(user.status === 0)  return { status: 406, message: 'User is not activated'  }
            else if(user.status === -1) return { status: 406, message: 'User is deleted'        }
    }

}

module.exports = new UserService()
