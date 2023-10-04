const mongoose = require("mongoose");
// const Warden=require('./warden.model')

const slotSchema = new mongoose.Schema({
    wardenID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warden',
    },
    bookedWith:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warden',
    },

    day: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  });
  
  const Slot = mongoose.model('Slot', slotSchema);

  module.exports=Slot;