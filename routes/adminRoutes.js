const express = require("express");
const router = express.Router();
const isApiKeyValid = require("../authLayer/adminController");
const addNewTrain = require("../dblayer/dbAccessor").addNewTrain;

router.post("/add/newtrain", isApiKeyValid, async (req, res) => {
  const { source, destination } = req.body;
  if (!source || !destination) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  try {
    const newTrain = {
      source,
      destination,
    };
    await addNewTrain(newTrain);
    res.status(200).json({
      msg: "Train added successfully",
      source,
      destination,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
