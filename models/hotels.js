const mongoose =require("mongoose")

const hotelSchema = new mongoose.Schema({
    hname:{
        type:String,
        required:true

    },
    hpnumber:{
        type : Number,
        required:true
    },
   hadate:{
        type : Date,
        required:true
    },
    hlday:{
        type : Date,
        required:true
    },
    hconemail:{
        type : String,
        required:true
    },
    hconnumber:{
        type : Number,
        required:true
    }
});

const hotel_booking = mongoose.model("Hotel_booking",hotelSchema ) 
module.exports=hotel_booking;