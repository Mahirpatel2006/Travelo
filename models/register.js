const mongoose = require("mongoose")

const linSchema = new mongoose.Schema({
    email : {
        type : String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true
    },
    cpassword : {
        type:String,
        required:true
    }
});

const Register = mongoose.model("Register", linSchema) ;

module.exports = Register;