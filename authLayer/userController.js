const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ msg: "Please login first" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.exp <= Math.floor(Date.now() / 1000)) {
      return res.status(403).json({ msg: "You have to login again" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Invalid token" });
  }
  next();
}

module.exports = auth;
