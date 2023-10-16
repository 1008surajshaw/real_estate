

const nodemailer = require('nodemailer');
const emailTemplate = require('../mails/emailVerificationTempelate');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

// Define the OTP model
const OTP = sequelize.define('OTP', {
  email: {
    type: DataTypes.STRING, // Change 'varchar' to 'STRING'
    allowNull: false,
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName:'otp'
});

sequelize.sync()
  .then(() => {
    console.log('Models synchronized with the database');
  })
  .catch((error) => {
    console.error('Error synchronizing models:', error);
  });




// Define a function to send emails
async function sendVerificationEmail(email, otp) {
  console.log("hello",email,otp);
  const transporter = nodemailer.createTransport({
    service: 'YourEmailService', // e.g., 'Gmail'
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_email_password',
    },
  });
  console.log(transporter,"hii")

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Verification Email',
    html: emailTemplate(otp),
  };

  try {
    const mailResponse = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: ', mailResponse.response);
  } catch (error) {
    console.log('Error occurred while sending email: ', error);
    throw error;
  }
}

// Define a Sequelize hook to send email after the document has been created
OTP.afterCreate(async (otp) => {
  console.log("Db");
  console.log('New document saved to database');

  // Send an email when a new document is created
  await sendVerificationEmail(otp.email, otp.otp);
});

module.exports = OTP;
