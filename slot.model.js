const mongoose=require('mongoose')

const slotSchema=new mongoose.Schema({
        wardenID:{
            type:String,
            required:true,
        },
        day:{
            type:String,
            required:true,
        },
        time:String,
       booked:Boolean
    
})

const Slot=mongoose.model('Slot',slotSchema)

module.exports=Slot