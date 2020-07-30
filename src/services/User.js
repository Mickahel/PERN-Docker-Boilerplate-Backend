//const download = require('image-downloader')
const UserRepository = require('../repositories/User')
const _ = require('lodash')
const path = require('path')

const Logger = require('./Logger')
const logger = new Logger("User Service", "#c2c2c2")


const UserService = class UserService {

    async isUserRegistrated(email) {
        try {
            if (!email) return false
            const user = await UserRepository.getUserByMail(email)
            if (!user) return false
            // ? the user is registered
            if (user.status === 1) return { status: 409, message: 'User is registered' }
            else if(user.status === 0) return { status: 406, message: 'User is not activated' }
            else if(user.status === -1) return { status: 406, message: 'User is deleted' }
        } catch (e) {
            throw e
        }
    }

}

module.exports = new UserService()
