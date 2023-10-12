const { contactUsEmail} = require("../mails/ContactFormRes")

const mailSender =require("../utils/mailSender")

exports.contactUs =async (req,res) =>{
    const { email,firstname,lastname,message,phoneNo,countrycode } =req.body

    console.log(req.body)
    try{
     const emailRes =await mailSender(
        email,
        "your Data send successfully",
        contactUsEmail(email,firstname,lastname,message,phoneNo,countrycode)
     )
     console.log("Email res",emailRes)
     return res.json({
        success:true,
        message:"Email send Successfully"
     })
    }
    catch(error){
     console.log("Error ",error)
     console.log("Error message :" ,error.message)
     return res.json({
        success:true,
        message: "something went wrong..."
     })
    }
}