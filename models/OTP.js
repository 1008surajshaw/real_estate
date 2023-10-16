const nodemailer = require('nodemailer');
const mailSender =require("../utils/mailSender");
const emailTemplate = require('../mails/emailVerificationTempelate'); // Make sure you have the correct path

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

// Define the OTP model
const OTP = sequelize.define('OTP', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'otp'
});

// Sync the model with the database
(async () => {
  try {
    await sequelize.sync();
    console.log('Models synchronized with the database');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
})();




async function sendVerificationEmail(email, otp) {
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		);
    console.log("123456................................")
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Define a post-save hook to send email after the document has been saved
OTP.afterCreate(async (otp)=> {
  console.log('New document saved to the database');

  // Send an email when a new document is created
  await sendVerificationEmail(otp.email, otp.otp);
});


module.exports = OTP;
