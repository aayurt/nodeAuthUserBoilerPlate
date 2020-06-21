var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var indexRouter = require("./routes/index");
const passport = require("passport");
var app = express();
//middleware set
require("./config/passport")(passport);

//end
app.use(logger("dev"));
app.use(cors());
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

module.exports = app;
