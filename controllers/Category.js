const Category = require("../models/Category");
const { Mongoose }  =require("mongoose")
const {Contact} from "../contact.js"
function getRandomInt(max) {
   return Math.floor(Math.random() * max)
 }

exports.createCategory = async (req,res) =>{
  try{
     const { name } =req.body;
     if(!name ) {
        return res.status(400).json({
            success:false,
            message:"all field are required",
        })
     }
     const CategoryDetails =await Category.create({
        name:name,
        
     });
     console.log(CategoryDetails);
     return res.status(200).json({
        success:true,
        message:'Category created successfully'
     })
  }
  catch(error){
     return res.status(500).json({
      success:false,
      message:'come in cath block in create category'
     })
  }
}

//getall category

exports.showAllCategories =async(req,res) =>{
    try{
      const allCategorys =await Category.find({});
     return res.status(200).json({
        success:true,
        message:"all tag are this ok",
        data:allCategorys,
      })
    }
    catch(error){
      return res.status(500).json({
         success:false,
         message:'come in cath block in all  category',
        })
    }
}

exports.categoryPageDetails = async (req, res) => {
   try {
     const { categoryId } = req.body
     console.log("PRINTING CATEGORY ID: ", categoryId);
     // Get courses for the specified category
     const selectedCategory = await Category.findById(categoryId)
       .populate({
         path: "Properties",
         match: { status: "Published" },
         populate: "ratingAndReviews",
       })
       .exec()
 
     //console.log("SELECTED COURSE", selectedCategory)
     // Handle the case when the category is not found
     if (!selectedCategory) {
       console.log("Category not found.")
       return res
         .status(404)
         .json({ success: false, message: "Category not found" })
     }
     // Handle the case when there are no courses
     if (selectedCategory.courses.length === 0) {
       console.log("No courses found for the selected category.")
       return res.status(404).json({
         success: false,
         message: "No courses found for the selected category.",
       })
     }
 
     // Get courses for other categories
     const categoriesExceptSelected = await Category.find({
       _id: { $ne: categoryId },
     })
     let differentCategory = await Category.findOne(
       categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
         ._id
     )
       .populate({
         path: "Properties",
         match: { status: "Published" },
       })
       .exec()

       res.status(200).json({
         success: true,
         data: {
           selectedCategory,
           differentCategory,
          
         },
       })
   } catch (error) {
     return res.status(500).json({
       success: false,
       message: "Internal server error",
       error: error.message,
     })
   }
 }
