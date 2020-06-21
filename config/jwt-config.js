require("dotenv").config();
module.exports = {
  login: {
    jwtExpiration: 10000,
    jwtEncryption: "secretKeyChangeable",
  },
};
