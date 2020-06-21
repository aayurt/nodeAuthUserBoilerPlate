'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    profileImage: DataTypes.STRING,
    loginId: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};