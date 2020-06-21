"use strict";

var _express = _interopRequireDefault(require("express"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = process.env.PORT || 3000;
var app = (0, _express["default"])();
app.listen(PORT, function () {
  return console.log("\uD83D\uDE80 the app is running in ".concat(process.env.NODE_ENV, " mode on port"), PORT);
});