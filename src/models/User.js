const { DataTypes } = require("sequelize");
const crypto = require("crypto");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { roles, statuses } = require("../../config");

const createModel = (database) => {
  const model = database.define("user", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },
    email: {
      type: DataTypes.STRING,
      unique: "emailUnique",
      allowNull: false,
    },
    salt: DataTypes.STRING,
    hash: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    activationCode: DataTypes.UUID,
    profileImageUrl: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM(roles.names()),
      defaultValue: roles.getRoleWithMinimumPermissionLevelByUserType(false)
        .name,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(statuses.names()),
      defaultValue: statuses.PENDING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: "en-EN",
      allowNull: false,
    },
    theme: {
      type: DataTypes.ENUM(["light", "dark"]),
      defaultValue: "light",
      allowNull: false,
    },
    refreshToken: DataTypes.STRING,
  });

  model.prototype.setStatus = function (status) {
    return (this.status = status);
  };
  model.prototype.setEmail = function (email) {
    return (this.email = email);
  };

  model.prototype.setFirstname = function (firstname) {
    return (this.firstname = firstname);
  };

  model.prototype.setLastname = function (lastname) {
    return (this.lastname = lastname);
  };

  model.prototype.setRefreshToken = function (refreshToken) {
    return (this.refreshToken = refreshToken);
  };

  model.prototype.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
      .pbkdf2Sync(password, this.salt, 10, 64, "sha512")
      .toString("hex");
  };

  model.prototype.isActive = function () {
    return this.status === 1;
  };

  model.prototype.setActivationCode = function () {
    this.activationCode = uuid();
  };

  model.prototype.validatePassword = function (password) {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, 10, 64, "sha512")
      .toString("hex");
    return this.hash === hash;
  };

  model.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());

    delete values.salt;
    delete values.hash;
    delete values.refreshToken;
    delete values.activationCode;

    return values;
  };

  return model;
};

module.exports = createModel;
