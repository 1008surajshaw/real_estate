const User =require("../models/User");
const OTP =require("../models/OTP");
const otpGenerator =require("otp-generator");
const properties = require("../models/Properties")
const bcrypt =require("bcrypt");
const jwt =require("jsonwebtoken");
require("dotenv").config();
const mailSender =require("../utils/mailSender");
const { passwordUpdated } =require("../mails/passwordUpdate");

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../models/sequelize")

//otp 



exports.sendotp = async (req, res) => {
    try {
      console.log("start");
      const { email } = req.body;
      console.log("start1");
      // Check if the user is already registered in your database

      try{
        const cheackUserPresent = await User.findOne({ where: { email } });
        console.log("start2");
        if (cheackUserPresent) {
          return res.status(401).json({
            success: false,
            message: 'User already registered',
          });
        }
      }
      catch(e)
      {
        function generateOTP() {
          return otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });
        }
                // Generate a 6-digit OTP
             const otp = generateOTP();
              try{

              // Check if the OTP is unique
              let result = await OTP.findOne({ where: { otp } });

              const otpPayload = { email, otp };

              // console.log('test', email, otp)
             
               //console.log('test', otpPayload);
              const otpBody = await OTP.create({
                email,
                otp,
              });

              }
               catch(error){
                
               }
              
              // Create a new OTP entry in your database
              res.status(200).json({
                success: true,
                message: 'OTP sent successfully',
                otp,
                
              });
          
              // Respond with the OTP sent successfully     

      }
      
    } catch (error) {
      console.log(error);
      console.log('Caught an error in sendotp');
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  

//sign up


exports.signup = async (req, res) => {
  try {
    const { email, otp, firstName, lastName, password, accountType, contactNumber } = req.body;
     
    // Check if the user is already registered
    try{
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User is already registered',
        });
      }
  
    }
   
    catch{
        // Find the most recent OTP for the user
      const response = await OTP.findOne({
        where: { email },
        order: [['createdAt', 'DESC']],
      });
      if (!response) {
        return res.status(400).json({
          success: false,
          message: 'OTP not found',
        });
      }
      console.log(response?.dataValues.otp,"................take")
      //console.log(response,"................take")
      // if (otp !== response?.dataValues.otp) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'Invalid OTP',
      //   });
      // }
      const hashedPassword = await bcrypt.hash(password, 10);

      // Set the 'approved' value based on 'accountType'
      const approved = accountType === 'Seller' ? false : true;
     //console.log('test',email, otp, firstName, lastName, password, accountType, contactNumber)
     // Create a new user in the database
      const user = await User.create({
        firstName,
         lastName,
         password: hashedPassword,
        accountType,
        contactNumber,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
        approved,
      });
       //console.log(user,"user ...............")

      return res.status(200).json({
        success: true,
        message: 'User registered successfully',
        
      
      });
      

    }
    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
      
    });
   

    

    // Validate OTP (if needed)

    // Hash the user's password
 
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'User registration failed',
    });
  }
};





//log in

// exports.login =async (req,res)=>{
//     try{
//     //get data from req body

//     const { email,password }=req.body;
//     //validition data
//     if(!email || !password){
//         return res.status(400).json({
//             success:false,
//             message:'all fields are required,please try again'
//         });
//     }
//     //user check exist or not
//    // const USER = await User.findOne({email})
//     const user =await User.findOne({ email })
//     // console.log(user);
//    //  console.log(USER);
//     if(!user){
//      return res.status(401).json({
//         success:false,  
//         message:"plzz sign  in first",
//     });
// }
// // const Payload ={
// //     email:user.email,
// //     id:user._id,
// //     role:user.accountType,
// // };
//     //generate password,  after password matching
//    if(await bcrypt.compare(password,user.password)) {
   
//     const token =jwt.sign(
//         { email: user.email, id: user._id, accountType: user.accountType },
//         process.env.JWT_SECRET,
//         {
//         expiresIn:"24h",
//     });


//     user.token =token;
//    // console.log(user);
//     user.password =undefined;



//     //create cookies and send response
//   const options ={
//     expires: new Date(Date.now()+3 * 24 * 60 * 60 * 1000),
//     httpOnly:true,
//   }
//     res.cookie("token",token,options).status(200).json({
//         success:true,
//         token,
//         user,
//         messaga:'loged in successfully'
//     });

//    }
//    else{
//     return res.status(401).json({
//         success:false,
//         message:'password is incorrect',
//     });
//    }

//     }
//     catch(error){
//      console.log(error)
//      return res.status(500).json({
//         success:false,
//         message:'login failure, come in catch block in log in time'
//      })
//     }
// }

// // change password 

// exports.changePassword =async (req,res) =>{
//   try{
//       //get DATA from req ,body
//     const userId = await User.findById(req.user.id);
//       console.log(userId)
     
//       const {oldPassword,password} =req.body;
//       console.log("9")
      
     
//       const isPasswordMatch =await bcrypt.compare(oldPassword,userId.password);
//       if(!isPasswordMatch){
//         toast.error("password not match")
//       }
//     const encryptredPassword = await bcrypt.hash(password,10);
//     console.log("1")
  
//       const updatedUserDetails =  await User.findByIdAndUpdate(
//          req.user.id,
//           {password:encryptredPassword},
//           {new:true},
//        )
//        console.log("1")
//       try{
//        const emailResponse =await mailSender(
//               updatedUserDetails.email,
//               "password update Confirmation",
//               passwordUpdated(

//                 updatedUserDetails.email,
//                 `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
//             )
//        );
//        console.log("Email sent successfully:", emailResponse.response);

//       }
//       catch(error){
//          // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
// 			console.error("Error occurred while sending email:", error);
// 			return res.status(500).json({
// 				success: false,
// 				message: "Error occurred while sending email",
// 				error: error.message,
// 			}); 
//       }
//       return res
//       .status(200)
//       .json({ success: true, message: "Password updated successfully" });
//   }
//   catch(error){
// // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
// console.error("Error occurred while updating password:", error);
// return res.status(500).json({
//     success: false,
//     message: "Error occurred while updating password",
//     error: error.message,
// });
//   }
//     }
