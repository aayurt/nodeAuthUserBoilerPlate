"use strict";
const crypto = require("crypto");
module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define(
    "Login",
    {
      userName: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return () => this.getDataValue("password");
        },
      },
      salt: {
        type: DataTypes.STRING,
        get() {
          return () => this.getDataValue("salt");
        },
      },
      forgetToken: DataTypes.STRING,
    },
    {}
  );
  Login.associate = function (models) {
    // associations can be defined here
    Login.hasOne(models.User, {
      foreignKey: "loginId",
      onDelete: "CASCADE",
    });
  };
  Login.generateSalt = function () {
    return crypto.randomBytes(16).toString("base64");
  };
  Login.encryptPassword = function (plainText, salt) {
    return crypto
      .createHash("RSA-SHA256")
      .update(plainText)
      .update(salt)
      .digest("hex");
  };
  Login.prototype.correctPassword = function (candidatePwd) {
    return Login.encryptPassword(candidatePwd, this.salt()) === this.password();
  };
  const setSaltAndPassword = (login) => {
    if (login.changed("password")) {
      login.salt = Login.generateSalt();
      login.password = Login.encryptPassword(login.password(), login.salt());
    }
  };
  Login.beforeCreate(setSaltAndPassword);
  Login.beforeUpdate(setSaltAndPassword);
  Login.beforeBulkCreate((logins) => {
    logins.forEach(setSaltAndPassword);
  });
  return Login;
};
