var express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const passport = require("passport");
require("../middleware/passport.middleware")(passport);
const middleware = function (req, res, next) {
  //requires auth

  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    function (err, user, info) {
      req.authenticate = !!user;
      req.user = user;
      if (!user) {
        return res.send("Authentication required for this call.");
      }
      next();
    }
  )(req, res, next);
};
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  onError: (err, next) => {
    console.log(err);
    next(err);
  },
});
/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({
    status: "success",
    message: "Welcome-to-NODE-BOILERPLATE",
    title: "Express",
  });
});
const userController = require("../controllers/user");
router.post(
  "/users/register",
  (upload.single("file"), middleware),
  userController.register
);
router.post("/users/login", userController.login);
router.get("/users", middleware, userController.list);
module.exports = router;
