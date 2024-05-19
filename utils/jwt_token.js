const dotenv = require("dotenv");
require("dotenv").config();
const jwt = require("jsonwebtoken");

function generateAccessToken(username, role) {
  return jwt.sign({ username, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

module.exports = generateAccessToken;
