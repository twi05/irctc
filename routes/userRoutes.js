const express = require("express");
const router = express.Router();
const auth = require("../authLayer/userController");
const { bookSeat } = require("../dblayer/dbAccessor");
const { getSeatAvailability } = require("../dblayer/dbAccessor");

const getBookedSeats = require("../dblayer/dbAccessor").getBookedSeats;

router.post("/get/seats", auth, async (req, res) => {
  const { src, dest } = req.body;
  if (!src || !dest) {
    return res
      .status(400)
      .json({ msg: "Please provide source and destination" });
  }
  try {
    const result = await getSeatAvailability(src, dest);
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/book/seats", auth, async (req, res) => {
  const { trainId, seatNumber } = req.body;
  const { userid } = req.headers;
  console.log("req.headers", req.headers);

  if (!userid || !trainId || !seatNumber) {
    return res.status(400).json({ msg: "Please enter all the fields" });
  }
  try {
    const result = await bookSeat(userid, trainId, seatNumber);
    res.status(200).json({ result });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal server error" });
    return;
  }
});

router.get("/bookedSeats/:trainId", async (req, res) => {
  try {
    const trainId = req.params.trainId;
    const bookedSeats = await getBookedSeats(trainId);
    res.status(200).json(bookedSeats);
  } catch (error) {
    console.error("Error getting booked seats:", error);
    res.status(500).send("An error occurred while getting booked seats");
  }
});
router.get("/getBookedSeatsByuserName/:userName", auth, async (req, res) => {
  try {
    const userName = req.params.userName;
    const bookedSeats = await getBookedSeatsByuserName(userName);
    res.status(200).json(bookedSeats);
  } catch (error) {
    console.error("Error getting booked seats:", error);
    res.status(500).send("An error occurred while getting booked seats");
  }
});

module.exports = router;
