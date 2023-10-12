const User =require("../models/User") ;
const mailSender =require("../utils/mailSender");
const bcrypt =require("bcrypt");
const crypto =require("crypto");



exports.resetPasswordToken =async(req,res) =>{
 try{
      //get email from req body 
      const email =req.body.email;
      console.log(email);
      // check user for this email,email validation
      const user =await User.findOne({email:email});
      if(!user){
          return res.json({
              success:false,
              message:"your email is not recognised with us"
          });
      }
     
      const token =crypto.randomBytes(20).toString("hex");
      const updatedDetail =await User.findOneAndUpdate(
                                          {email:email},
                                          {
                                              token:token,
                                              resetPasswordExpires: Date.now()+5*60*1000,
                                          },
                                          {new:true});
                                          console.log("DETAILS", updatedDetail);
      
  
      //create url
      const url =`http://localhost:3000/update-password/${token}`
      //send mail containing thwe url
      await mailSender(email,
                      "password Reset Link",
                      `password Reset link ${url}`);
      //return response
  
      return res.json({
          sucess:true,
          message:"eamil sent successfully , please check email and change password",
      });
      
 }
 catch(error){
      console.log(error);
      return res.status(500).json({
        success:false,
        message :"com ein catch block",
      })
 }

    
}

//reset password

 exports.resetPassword =async (req,res) =>{
     //data fetch
  try{
    const {password,confirmPassword,token} =req.body;
    //validation
    if(password !== confirmPassword){
       return res.json({
           success:false,
           message:'password not matching',
       })
    }
    const userDetails =await User.findOne({token:token});
    if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}
    //get userdetails from db using token
    //if no entry -invalid token
    if(!userDetails.resetPasswordExpires >  Date.now() ){
       return res.json({
           success:false,
           message:"time quantum expires"
       })
    }
    const hashedPassword = await bcrypt.hash(password,10);

    await User.findOneAndUpdate(
       {token:token},
       {password:hashedPassword},
       {new:true},
    );

    return res.status(200).json({
       success:true,
       message:'password reset sucessfully'
    });
  }
  catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message :"come in reset password catch block",
    })
  }
     //token time check
     //hash password
     //password update
     //return response
 }