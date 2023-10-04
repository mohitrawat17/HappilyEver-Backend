const mongoose = require("mongoose");

const WardenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  universityID: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
  booked: {
    type: Boolean,
    default: false,
  },
});

const Warden = mongoose.model("Warden", WardenSchema);

module.exports = Warden;
