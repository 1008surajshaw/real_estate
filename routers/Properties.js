const express =require("express");
const router =express.Router()

const{
    addProperties,
    editProperties,
    showAllProperties,
    getPropertiesdetails,
    getFullPropertiesDetails,
    deleteProperties,
    getSellerProperties
    
} =require("../controllers/Properties");

const {
    
    createCategory,
    categoryPageDetails,
    showAllCategories,
} =require("../controllers/Category")



const {
    createRating,
   
    getAllrating,
} =require("../controllers/RatingAndReview")


const { auth, isSeller ,isAdmin, isBuyer  } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Properties routes
// ********************************************************************************************************


// Courses can Only be Created by Instructors
router.post("/createProperties",auth,isSeller,addProperties)


router.post("/editProperties", auth, isSeller, editProperties)
// Get all Registered Courses
router.get("/getAllProperties",showAllProperties )
// Get Details for a Specific Courses
router.post("/getPropertiesDetails", getPropertiesdetails)
// Get Details for a Specific Courses
router.post("/getFullPropertiesDetails", auth, getFullPropertiesDetails)
// Get all Courses Under a Specific Instructor
router.get("/getSellerProperties", auth, isSeller, getSellerProperties)
router.delete("/deleteProperties", deleteProperties)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here

router.post("/createCategory",auth,isAdmin,createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isBuyer, createRating)

router.get("/getReviews", getAllrating)

module.exports = router