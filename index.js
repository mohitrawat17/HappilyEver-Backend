const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const Warden = require("./warden.model");
// const Slot =require('./slot.model')

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/HappilyEver");

app.post("/register", async (req, res) => {
  try {
    const user = new Warden({
      name: req.body.name,
      universityID: req.body.universityID,
      password: req.body.password,
      time: "10:00 AM",
      booked: false,
    });
    const result = await user.save();
    res.send({ status: "ok", result });
    // res.status(200).json({ status: "ok", result });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const user = await Warden.findOne(
    { universityID: req.body.universityID, password: req.body.password },
    { _id: 0, __v: 0 }
  );
  if (!user) {
    res.send({ status: "error", error: "Invalid Password or Id" });
  } else {
    const token = jwt.sign(
      {
        universityID: user.universityID,
      },
      "secret123"
    );
    res.send({ status: "ok", token: token, Sessions: user.sessionWith });
  }
});

// Route for fetching available slots
app.get("/slots", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const warden = jwt.verify(token, "secret123");
    const universityID = warden.universityID;
    const availableSlots = await Warden.find(
      { booked: false, universityID: { $ne: universityID } },
      { _id: 0, password: 0, __v: 0, day: 0, sessionWith: 0 }
    );
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for booking a slot
app.post("/book-slot", async (req, res) => {
  const { universityID, day, time } = req.body;
  const token = req.headers["x-access-token"];

  try {
    const warden = jwt.verify(token, "secret123");

    const existingSlot = await Warden.findOne({ universityID, booked: false });
    const user = await Warden.findOne({ universityID: warden.universityID });

    if (existingSlot) {
      //updating user who is booking meeting
      user.booked = true;
      user.sessionWith.push({
        wardenName: existingSlot.name,
        day: day,
        time: time,
      });
      await user.save();

      //updating user who is booked for meeting
      existingSlot.sessionWith.push({
        wardenName: user.name,
        day: day,
        time: time,
      });
      await existingSlot.save();
      res.json({ message: "Slot booked successfully!" });
    } else {
      res.status(404).json({ error: "Slot not available for booking" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(1000, () => {
  console.log("running on Port 1000");
});
