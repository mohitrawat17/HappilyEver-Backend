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
  sessionWith:[{wardenName:String,day:String,time:String}],
  time:String,
  booked: Boolean,
});

const Warden = mongoose.model("Warden", WardenSchema);

module.exports = Warden;
