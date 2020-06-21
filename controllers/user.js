const Login = require("../models").Login;
const User = require("../models").User;
const authService = require("../services/auth.services");
const validator = require("validator");

module.exports = {
  async register(req, res, next) {
    let errors = [];
    let results = {};
    const {
      userName,
      email,
      password,
      firstName,
      lastName,
      address,
      profileImage,
    } = req.body;
    console.log(req.body);

    if (validator.isEmpty(userName)) {
      errors.push({ msg: "Please enter a userName." });
    }
    if (validator.isEmpty(email)) {
      errors.push({ msg: "Please enter a email." });
    }
    if (validator.isEmpty(password)) {
      errors.push({ msg: "Please enter a password." });
    }
    if (password.length <= 4) {
      errors.push({ msg: "Please enter a min password 4." });
    }
    if (validator.isEmpty(firstName)) {
      errors.push({ msg: "Please enter a firstName." });
    }
    if (validator.isEmpty(lastName)) {
      errors.push({ msg: "Please enter a lastName." });
    }
    // if (validator.isEmpty(address)) {
    //   errors.push({ msg: "Please enter a address." });
    // }
    if (errors.length > 0) {
      results.response = "Error";
      results.errors = errors;
      return res.status(200).send(results);
    }
    try {
      console.log(req.body);

      await Login.build(
        {
          userName,
          email,
          password,
          User: {
            firstName,
            lastName,
            address,
            profileImage: req.file ? req.file.filename : "",
          },
        },
        {
          include: [{ model: User }],
        }
      )
        .save()
        .then((newUser) => {
          results.response = "success";
          results.userId = newUser.id;
          res.status(201).send(results);
        })
        .catch((err) => {
          results.response = "Error";
          errors.push({ msg: err });
          results.errors = errors;
          return res.status(400).send(errors);
        });
    } catch (error) {
      results.response = "Error in build";
      results.errors = error;
      return res.status(200).send(results);
    }
  },
  async login(req, res, next) {
    let errors = [];
    let results = {};
    if (!req.is("application/json")) {
      errors.push({ msg: "expects application/json" });
    }
    const { username, password } = req.body;
    if (validator.isEmpty(username)) {
      errors.push({ msg: "Please enter a username." });
    }
    if (validator.isEmpty(password)) {
      errors.push({ msg: "Please enter a password." });
    }
    if (errors.length > 0) {
      results.response = "Error";
      results.errors = errors;
      return res.status(200).send(results);
    }
    try {
      await authService.authUser(req.body, (err, data) => {
        if (err) {
          errors.push({ msg: err });
          results.response = "errors";
          results.errors = errors;
          return res.status(200).send(results);
        }
        if (data.response === "errors") {
          errors.push({ msg: "Please check email/password." });
          results.response = "errors";
          results.errors = errors;
          return res.status(200).send(results);
        }
        res.status(200).send(data);
      });
    } catch (err) {
      next(err);
    }
  },
  async list(req, res, next) {
    let errors = [];
    let results = {};
    try {
      await Login.findAll().then((list) => {
        results.response = "success";
        results.data = list;
        res.status(201).send(results);
      });
    } catch (err) {
      next(err);
    }
  },
};
