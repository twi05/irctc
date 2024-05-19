const express = require("express");
const app = express();
const pool = require("./utils/connection");
require("dotenv").config();

const registratonRoute = require("./routes/registerRoutes");
const loginRoutes = require("./routes/loginRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const port = 5000;

pool.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  }
  if (connection) {
    connection.release();
    console.log("Connected to IRCTC database");
  }
  return;
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/api", registratonRoute);
app.use("/api/login", loginRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
