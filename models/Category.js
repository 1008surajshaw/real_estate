const mongoose =require("mongoose");

const categorySchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    
    properties:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Properties",
    }
],
});

module.exports =mongoose.model("Category",categorySchema);