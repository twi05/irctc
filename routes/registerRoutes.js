const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const registerUser = require("../dblayer/dbAccessor").registerUser;
const generateAcessToken = require("../utils/jwt_token");
const { getUserByName } = require("../dblayer/dbAccessor");

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    const existingUser = await getUserByName(username);

    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username: username,
      password: hashedPassword,
      role: role,
    };
    await registerUser(newUser);

    const token = generateAcessToken(username, role);

    res
      .status(200)
      .json({ msg: "User registered successfully", username, role, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
