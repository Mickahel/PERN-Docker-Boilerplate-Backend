const {DataTypes} = require("sequelize");
const crypto = require("crypto");
const { v4: uuid } = require('uuid');
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { roles } = require("../../config");
const Logger = require("../services/Logger");
const logger = new Logger("User Model", "#facafa");

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
        allowNull: false 
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    activationCode: DataTypes.UUID,
    profileImageUrl: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM(Object.values(roles).map((role)=>role.name)),
      defaultValue: roles.BASE.name,
      allowNull:false
    },
    status: {
      type: DataTypes.INTEGER, //? 1=Activated, 0=Activation pending, -1=Trashed
      defaultValue: 0,
      allowNull: false
    }, 
    refreshToken: DataTypes.STRING
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
    delete values.activationCode;
    return values;
  };

  return model;
};

module.exports = createModel;
