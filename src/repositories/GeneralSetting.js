const { database } = require("../models");
const _ = require("lodash");

class GeneralSettingRepository {
  getList() {
    return database.models.generalSetting.findAll({ raw: true });
  }

  async createGeneralSetting(generalSetting) {
    return await database.models.generalSetting.create(generalSetting);
  }

  async updateGeneralSetting(generalSetting, newGeneralSetting) {
    await generalSetting.update(newGeneralSetting);
  }

  getGeneralSettingByFeature(feature, raw = true) {
    return database.models.generalSetting.findOne({
      where: {
        feature,
      },
      raw,
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
