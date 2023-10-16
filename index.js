const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary")
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv")
dotenv.config();
const contact = require("./routers/Contact")
const Properties = require("./routers/Properties")
const User = require("./routers/User")
 const PORT = process.env.PORT || 5000;
// const database = require("./config/database")
const database = require('./models/sequelize')
const { Sequelize } = require('sequelize');



//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"*",
        credentials:true,
    })
)
cloudinaryConnect();
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)
app.use("/api/v1/auth",User);
// app.use("/api/v1/contact",contact);
// app.use("/api/v1/properties",Properties);


app.get("/",(req,res) =>{
    return res.json({
        success:true,
        message:"your server is running at port no.."
    })
})

app.listen(PORT, () =>{
    console.log(`app is running at port no ${PORT}`)
})