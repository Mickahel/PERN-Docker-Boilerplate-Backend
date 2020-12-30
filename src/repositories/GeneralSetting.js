const { database } = require("../models");
const _ = require("lodash");

class GeneralSettingRepository {
  getAll() {
    return database.models.generalSetting.findAll();
  }

  async createGeneralSetting(generalSetting) {
    return await database.models.generalSetting.create(generalSetting);
  }

  async updateGeneralSetting(generalSetting, newGeneralSetting) {
    await generalSetting.update(newGeneralSetting);
  }

  getGeneralSettingByFeature(feature) {
    return database.models.generalSetting.findOne({
      where: {
        feature,
      },
    });
  }

  deleteGeneralSettingByFeature(feature) {
    return database.models.generalSetting.destroy({
      where: {
        feature,
      },
    });
  }
}

module.exports = new GeneralSettingRepository();
