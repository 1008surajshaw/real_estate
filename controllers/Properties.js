const Properties = require("../models/Properties")
const Category =require("../models/Category");

const User =require("../models/User");
const { uploadImageToCloudinary } =require("../utils/imageUploder");
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

exports.addProperties = async (req, res) => {
	try {
	  // Get user ID from request object
	  const userId = req.user.id
  
	  // Get all required fields from request body
	  let {
		propertiesAddress,
		propertiesDescription,
		options,
		price,
		tag: _tag,
		category,
		instructions: _instructions,
	  } = req.body
	  // Get thumbnail image from request files
	   const thumbnail = req.files.thumbnailImage
	  console.log("1")
  
	  // Convert the tag and instructions from stringified Array to Array
	  const tag = JSON.parse(_tag)
	  const instructions = JSON.parse(_instructions)
      console.log("1")

	 
  
	  // Check if any of the required fields are missing
	  if (
		!propertiesAddress ||
		!propertiesDescription ||
		!price ||
		!thumbnail ||
		!category ||
		!options
		
	  ) {
		return res.status(400).json({
		  success: false,
		  message: "All Fields are Mandatory",
		})
	  }
	 
	  // Check if the user is an instructor
	  const sellerDetails = await User.findById(userId, {
		accountType: "Seller",
	  })
  
	  if (!sellerDetails) {
		return res.status(404).json({
		  success: false,
		  message: "Instructor Details Not Found",
		})
	  }
  
	  // Check if the tag given is valid
	  const categoryDetails = await Category.findById(category)
	  if (!categoryDetails) {
		return res.status(404).json({
		  success: false,
		  message: "Category Details Not Found",
		})
	  }
	 
// Create an array to store the uploaded thumbnail URLs
    const thumbnailURLs = [];

// Upload each thumbnail image to Cloudinary
     for (const thumbnail of thumbnailImages) {
     const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
     thumbnailURLs.push(thumbnailImage.secure_url);
    }
	  //
	  console.log(thumbnailImage)
	  // Create a new course with the given details
	  const newProperties = await Properties.create({
		propertiesAddress,
		propertiesDescription,
		seller: sellerDetails._id,
	    options,
		price,
		tag,
		category: categoryDetails._id,
		thumbnail:thumbnailURLs,
		
		instructions,
	  })
  
	  // Add the new course to the User Schema of the Instructor
	  await User.findByIdAndUpdate(
		{
		  _id: sellerDetails._id,
		},
		{
		  $push: {
			properties: newProperties._id,
		  },
		},
		{ new: true }
	  )
	  // Add the new course to the Categories
	  const categoryDetails2 = await Category.findByIdAndUpdate(
		{ _id: category },
		{
		  $push: {
			properties: newProperties._id,
		  },
		},
		{ new: true }
	  )
	  console.log("HEREEEEEEEE", categoryDetails2)
	  // Return the new course and a success message
	  res.status(200).json({
		success: true,
		data: newProperties,
		message: "properties Created Successfully",
	  })
	} catch (error) {
	  // Handle any errors that occur during the creation of the course
	  console.error(error)
	  res.status(500).json({
		success: false,
		message: "Failed to create properties",
		error: error.message,
	  })
	}
  }

  exports.editProperties = async (req, res) => {
	try {
	  const { propertiesId } = req.body
	  const updates = req.body
	  console.log("edit course",updates)
	  const properties = await Properties.findById(propertiesId)
  
	  if (!properties) {
		return res.status(404).json({ error: "Course not found" })
	  }
  
	  // If Thumbnail Image is found, update it
	   if (req.files) {
	 	console.log("thumbnail update")
	 	const thumbnail = req.files.thumbnailImage
	 	const thumbnailImage = await uploadImageToCloudinary(
	 	  thumbnail,
	 	  process.env.FOLDER_NAME
	 	)
	 	properties.thumbnail = thumbnailImage.secure_url
	   }
  
	  // Update only the fields that are present in the request body
      console.log("edit course again",updates)
	  for (const key in updates) {
		if(updates.hasOwnProperty(key)){
		  if (key === "tag" || key === "instructions") {
			Properties[key] = JSON.parse(updates[key])
		  } else {
			Properties[key] = updates[key]
		  }
		}
	  }
      console.log("course  ka ",course)
	  await course.save()
  
	  const updatedProperties = await Properties.findById({
		_id: propertiesId,
	  })
		.populate({
		  path: "Seller",
		 
		})
		.populate("category")
		.populate("ratingAndReviews")
		
		.exec()
  
	  res.json({
		success: true,
		message: "Course updated successfully",
		data: updatedProperties,
	  })
	} catch (error) {
	  console.error(error)
	  res.status(500).json({
		success: false,
		message: "Internal server error",
		error: error.message,
	  })
	}
  }

exports.showAllProperties = async (req,res) =>{
  try{
   const allProperties =await Properties.find({},{propertiesAddress:true,
                                            price:true,
                                            thumbnail:true,
                                            ratingAndReview:true,
                                            instructor:true,
                                            })
                                            .populate("seller")
                                            .exec();

  return res.status(200).json({
       success:true,
        message:"data fectch succesfully",
        data:allProperties,
  })
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"cannot fetch course data",
      error:error.message,
    })
  }

}


exports.getPropertiesdetails =async (req,res) =>{
  try{
    const { propertiesId } =req.body;
    console.log("hello world");
    const propertiesDetails =await Properties.findById(
                                       propertiesId)

                                         .populate(
                                          {
                                            path:"Seller",
											select:"-properties",
                                          })
                                         .populate({path :"ratingAndReviews"})
                                         
                                           .exec();

     console.log("baghi ya billi",propertiesDetails);
	if(!courseDetails){
		return res.status(400).json({
		  success:false,
		  message:"could not find the properties Details"
		})
	  } 

    
    return res.status(200).json({
      success:true,
      message:"course Details fetched succesfully",
	  propertiesDetails,
	  
    })                                  
                                         
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"catch block could not find the course Details"
    })
  }
}

exports.getFullPropertiesDetails = async (req,res) =>{
	try{
        
		const { propertiesId } = req.body
		
		const userId = req.user.id
		console.log("instructor ka >>>",userId)
		const propertiesDetails = await Properties.findOne({_id: propertiesId})
		.populate({
			path:"Seller",
			
		})
		.populate("category")
		
		
		  .exec()
		console.log("lkjo",courseDetails)
        
		let courseProgressCount = await CourseProgress.findOne({courseID:courseId,userId})

		console.log("courseProgressCount",courseProgressCount)

		if (!courseDetails) {
			return res.status(400).json({
			  success: false,
			  message: `Could not find course with id: ${courseId}`,
			})
		  }
		let totalDurationInSecond = 1000
		courseDetails?.courseContent.forEach((content) =>{
			content?.subsection.forEach((subSection) => {
				const timeDurationInSecond = parseInt(subSection.timeDuration)
				totalDurationInSecond +=timeDurationInSecond
			})
		})

		const totalDuration = convertSecondToDuraton(totalDurationInSecond)
         console.log("courseDuration>>>>",totalDuration)
		return res.status(200).json({
			success:true,
			data:{
				courseDetails,
				totalDuration,
				completedVideos : courseProgressCount?.completedVideos ? courseProgressCount?.completedVideos : [],
			},
		})
	   
		
	  
	}
	catch(error){

		return res.status(500).json({
			success: false,
			message: error.message,
		  })
		}
}

exports.deleteProperties = async (req,res) =>{
	try{

		const { propertiesId } =req.body
		
		const properties = await Properties.findById(propertiesId)
		console.log(properties)
		if (!properties) {
			return res.status(404).json({message:"properties not found"})
		}

		

		
		await Properties.findByIdAndDelete(courseId)

		return res.status(200).json({
			success:true,
			message:"course deleted succcessfully"
		})

	}
	catch(error){
		console.error(error)
		return res.status(500).json({
		  success: false,
		  message: "Server error",
		  error: error.message,
		})	
	}
}

exports.getSellerProperties = async (req,res) =>{
	try{

		const sellerId = req.user.id
		console.log(sellerId);
        console.log("One")
		const sellerProperties = await Properties.find({
			Seller:sellerId,
		}).sort({createdAt: -1})

		res.status(200).json({
			success:true,
			
			data:sellerProperties,
		})
	}
	catch(error){

		console.error(error)
		res.status(500).json({
		  success: false,
		  message: "Failed to retrieve instructor courses",
		  error: error.message,
		})
	}
}

