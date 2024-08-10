const mongoose =require("mongoose")

const conSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    pnumber:{
        type : Number,
        required:true
    },
    adate:{
        type : Date,
        required:true
    },
    lday:{
        type : Date,
        required:true
    },
    conemail:{
        type : String,
        required:true
    },
    connumber:{
        type : Number,
        required:true
    }
});

const contact_info = mongoose.model("contact_info",conSchema) 
module.exports=contact_info;
