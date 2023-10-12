const RatingAndReview =require("../models/RatingAndReview");

const User =require("../models/User");
const { default: mongoose } = require("mongoose");
const Properties = require("../models/Properties");

//createRating

exports.createRating =async (req,res) =>{
    try{
       const {review,rating} =req.body;
       const userid =req.user.id;
    const ratingReview =await RatingAndReview.create({
                                                rating,
                                                review,  
                                                user:userid,
    });
    console.log(ratingReview);

    return res.status(200).json({
        success:true,
        message:"rating and review succesfully"
    })
    }
    catch(error){
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"come in catch block"
    })
    }
}



//getallrating
exports.getAllrating =async(re,res) =>{
    try{
      const allReview =await RatingAndReview.find({})
                                                  .sort({rating:"desc"})
                                                  .populate({
                                                    path:
                                                     "user",
                                                     select:"firstName lastName email image"
                                                    
                                                  })
                                                  .populate({
                                                    path:"Properties",
                                                    select:"propertiesName",
                                                  })
                                                  .exec();
    return res.status(200).json({
        success:true,
        message:"all review fetched successfully",
        allReview,
    })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"catch block could not find the allRating"
          })
    }
}