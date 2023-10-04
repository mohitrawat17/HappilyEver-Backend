const mongoose = require("mongoose");
// const Slot=require('./slot.model')


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
  time:{
    type:String
  },
  booked:{
    type:Boolean,
    default :false
  }
  //  bookSlot:{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Slot'
  //  }
});

const Warden = mongoose.model("Warden", WardenSchema);

module.exports = Warden;
