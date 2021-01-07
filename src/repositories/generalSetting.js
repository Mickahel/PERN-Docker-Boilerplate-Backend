const { database } = require("../models");
const _ = require("lodash");

class GeneralSettingRepository {
  getAll() {
    return database.models.generalSetting.findAll();
  }

  createGeneralSetting(generalSetting) {
    return database.models.generalSetting.create(generalSetting);
  }

  updateGeneralSetting(generalSetting, newGeneralSetting) {
    return generalSetting.update(newGeneralSetting);
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
