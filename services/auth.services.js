"use strict";
//Login Requirement
const jwt = require("jsonwebtoken");
const config = require("../config/jwt-config");
const Login = require("../models").Login;
function getUniqueKey(body) {
  let unique_key = null;
  if (body.username) unique_key = body.username;
  return unique_key;
}
const authUser = async function (userInfo, callback) {
  let unique_key;
  let auth_info = {};
  auth_info.status = "login";
  console.log("userInfo", userInfo);

  unique_key = getUniqueKey(userInfo);
  if (!unique_key)
    return callback(new Error("Please enter an Usrname to login"));
  if (!userInfo.password)
    return callback(new Error("Please enter a password to login"));
  console.log("uniqueKey", unique_key);
  await Login.findOne({
    where: {
      userName: unique_key,
    },
  })
    .then((user) => {
      if (!user) {
        return callback("Not Registered");
      } else {
        const result = user.correctPassword(userInfo.password);
        if (result) {
          if (user.approval === "pending")
            return callback(null, { response: "pending" });
          if (user.approval === "denied")
            return callback(null, { response: "denied" });

          const { token, expiration } = issueToken(user.id);
          callback(null, { response: "success", token, expiration, user });
        } else {
          return callback(null, { response: "error" });
        }
      }
    })
    .catch((err) => console.log(err));
};
module.exports.authUser = authUser;
function issueToken(userId) {
  const expiration = parseInt(config.login.jwtExpiration);
  const token =
    "Bearer: " +
    jwt.sign({ userId }, config.login.jwtEncryption, {
      expiresIn: expiration,
    });
  return { token, expiration };
}
