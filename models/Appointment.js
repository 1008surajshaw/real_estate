const mongoose =require("mongoose");

const appointmentSchema =new mongoose.Schema({
    
    description:{
        type:String,
    },
    properties:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Properties",
    },
    
],
    date: {
    type:Date,
    default:Date.now,
},
});

module.exports =mongoose.model("Category",appointmentSchema);