const { database } = require("../models");
const Sequelize = require("sequelize");
const _ = require("lodash");
const { statuses } = require("../../config");
class UserRepository {
  getTotal() {
    return database.models.user.count({
      group: ["status"],
    });
  }

  getUserList(includeDisabledUsers = false) {
    if (includeDisabledUsers) {
      return database.models.user.findAll({});
    } else {
      return database.models.user.findAll({
        where: {
          status: { [Sequelize.Op.not]: statuses.DISABLED },
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

  getUserById(id) {
    return database.models.user.findOne({
      where: {
        id,
      },
    });
  }

  getUserByActivationCode(activationCode) {
    return database.models.user.findOne({
      where: {
        activationCode,
      },
    });
  }

  getRefreshToken(refreshToken) {
    return database.models.user.findOne({
      attributes: ["refreshToken"],
      where: {
        refreshToken,
      },
    });
  }

  async createUser(user, generateActivationCode = true) {
    const newUser = database.models.user.build(user);
    if (user.password) newUser.setPassword(user.password);
    if (generateActivationCode) newUser.setActivationCode();
    return await newUser.save();
  }

  async updateUser(user, newData) {
    if (newData.password) {
      user.setPassword(newData.password);
      await user.save();
    }
    return await user.update(newData);
  }
  async setRefreshToken(user, refreshToken) {
    user.setRefreshToken(refreshToken);
    await user.save();
  }

  deleteRefreshToken(refreshToken) {
    return database.models.user.update(
      {
        refreshToken: null,
      },
      {
        where: {
          refreshToken,
        },
      }
    );
  }

  deleteUser(user) {
    if (!user) return;

    return database.models.user.destroy({
      where: {
        id: user.id,
      },
    });
  }
}

module.exports = new UserRepository();
