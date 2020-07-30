const { database } = require("../models");
const Sequelize = require("sequelize");
const _ = require("lodash");

const Logger = require("../services/Logger");
const logger = new Logger("User Repository", "#a1e1a1");

const UserRepository = class UserRepository {
  getTotal() {
    return models.user.count({
      group: ["status"],
    });
  }

  getUserList(includeDeletedUsers = false) {
    if (includeDeletedUsers) {
      return database.models.user.findAll({});
    } else {
      return database.models.user.findAll({
        where: {
          status: { [Sequelize.Op.not]: -1 },
        },
      });
    }
  }

  getUserByMail(email) {
    return database.models.user.findOne({
      where: {
        email,
      },
    });
  }

  getById(id) {
    return database.models.user.findOne({
      where: {
        id,
      }
    });
  }

  getUserByActivationCode(activationCode){
    return database.models.user.findOne({
      where:{
        activationCode
      }
    })
  }
  async createUser(user, generateActivationCode=true){
    try{

      const newUser = database.models.user.build(user)
      if(user.password) newUser.setPassword(user.password)
      if(generateActivationCode) newUser.setActivationCode()
      return await newUser.save() 
    }catch(e){
      throw e;
    }
  }
  
  delete(user){
    if(!user) return

    return database.models.user.destroy({
      where:{
        id: user.id
      }
    })
  }


};

module.exports = new UserRepository()