const mongoose = require("mongoose")
// const { findOneAndUpdate } = require("./register")
const revSchema= new mongoose.Schema({
    revname :{
        type:String,
        required:true
    },
    revplace:{
        type:String,
        required:true
    },
    
    revemail:{
        type:String,
        required:false

    },
    revnumber:{
        type:Number,
        required:false
    },
    review:{
        type:String,
        required:true
    }
});
const Review = mongoose.model("Review",revSchema ) ;

module.exports = Review;