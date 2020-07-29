const {DataTypes } = require("sequelize");
const crypto = require("crypto");
const { v4: uuid } = require('uuid');
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { roles } = require("../../config");
const Logger = require("../services/Logger");
const logger = new Logger("User Model");

const createModel = (database) => {
  const model = database.define("user", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuid(),
    },
    email: { 
        type: DataTypes.STRING, 
        unique: true,
        allowNull: false },
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
      type: DataTypes.ENUM(Object.values(roles)),
      defaultValue: roles.BASE,
      allowNull:false
    },
    status: {
      type: DataTypes.INTEGER, //? 1=Activated, 0=Activation pending, -1=Trashed
      defaultValue: 0,
      allowNull: false
    },
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

  model.prototype.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
      .pbkdf2Sync(password, this.salt, 10000, 128, "sha512")
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
      .pbkdf2Sync(password, this.salt, 10000, 128, "sha512")
      .toString("hex");
    return this.hash === hash;
  };

  model.prototype.generateJWT = function (data) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(
      today.getDate() + _.get(process.env, "EXPIRATION_DAYS", 60)
    );
    const token = jwt.sign(
      {
        id: this.id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
      },
      process.env.SECRET
    );
    return { token, tokenExpirationDate: expirationDate.getTime() };
  };

  model.prototype.toAuthJSON = function (data) {
    return {
      id: this.id,
      email: this.email,
      token: this.generateJWT(data),
    };
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
