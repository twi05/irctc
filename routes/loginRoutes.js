const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const getUserByName = require("../dblayer/dbAccessor").getUserByName;
const generateAcessToken = require("../utils/jwt_token");

router.post("/user", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ msg: "Please provide username and password" });
  }

  const checkUser = await getUserByName(username);

  if (checkUser.length === 0) {
    return res.status(400).send({ msg: "User does not exist.Please sign up" });
  }

  const validPassword = await bcrypt.compare(password, checkUser[0].password);
  if (!validPassword) {
    return res.status(400).send({ msg: "Invalid password" });
  }

  const token = generateAcessToken(username, checkUser[0].id);
  if (role === "admin" && checkUser[0].role !== "admin") {
    return res
      .status(400)
      .send({ msg: "You are not authorized to login as admin" });
  }
  if (role === "user" && checkUser[0].role !== "user") {
    return res
      .status(400)
      .send({ msg: "You are not authorized to login as user" });
  }
  if (role === "admin" && checkUser[0].role === "admin") {
    return res.status(200).send({
      msg: "Login successful",
      username: checkUser[0].username,
      role: checkUser[0].role,
      id: checkUser[0].id,
      token,
      apiKey: process.env.ADMIN_API_KEY,
    });
  }
  res.status(200).send({
    msg: "Login successful",
    username: checkUser[0].username,
    role: checkUser[0].role,
    id: checkUser[0].id,
    token,
  });
});

module.exports = router;
