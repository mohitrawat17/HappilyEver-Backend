const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Warden = require("./warden.model");
const Session = require("./slot.model");

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
      // booked: false,
    });
    const result = await user.save();
    res.send({ status: "ok", result });
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const user = await Warden.findOne({
    universityID: req.body.universityID,
    password: req.body.password,
  });
  if (!user) {
    res.send({ status: "error", error: "Invalid Password or Id" });
  }

  const pendingSessions = await Session.find(
    { bookedWith: user._id },
    { _id: 0 }
  );

  try {
    if (pendingSessions) {
      const token = jwt.sign(
        {
          universityID: user.universityID,
        },
        "secret123"
      );
      res.send({ status: "ok", token: token, Sessions: pendingSessions });
    } else {
      const token = jwt.sign(
        {
          universityID: user.universityID,
        },
        "secret123"
      );
      res.send({ status: "ok", token: token });
    }
  } catch (error) {
    res.send({ status: "error", error: error.message });
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

app.post("/book-slot", async (req, res) => {
  const { universityID, day, time } = req.body;
  const token = req.headers["x-access-token"];

  try {
    const warden = jwt.verify(token, "secret123");

    const existingSlot = await Warden.findOne({ universityID, booked: false }); // warden with whom we are booking session slot

    const user = await Warden.findOne({ universityID: warden.universityID }); // warden who is booking slot

    if (existingSlot) {
      // Create session for the booking
      const session = new Session({
        wardenID: user._id,
        bookedWith: existingSlot._id,
        day: day,
        time: time,
      });

      await session.save();

      // Update booked status for both users
      user.booked = true;
      // existingSlot.booked = true;

      await user.save();
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
