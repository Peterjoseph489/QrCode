const qrCode = require('qrcode');
const fs = require('fs');
const { Content } = require('mailgen');
const generateMail = require('../middlewares/genTemplate');
const mailSender = require('../middlewares/mail');
const QrCodeSchema = require('../models/qrcode.model');
const Cloudinary = require('../middlewares/cloudinary');

const sendMailCode = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Generate the QR code as a Data URL
    const qrImage = await qrCode.toDataURL(email);

    // Upload the QR code image to Cloudinary
    const result = await Cloudinary.uploader.upload(qrImage, {
      folder: 'qr_codes',
      public_id: 'my_qr_code'
    });

    const imageUrl = result.secure_url;
    const subject = "Ticket QR Code!";

    // Create the email template
    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Ticket with QR Code</title>
      </head>
      <body>
        <h1>Welcome to Your Event Booking App</h1>
        <p>Hello ${name}</p>
        <p>Your event ticket is attached as a QR code:</p>
        <!-- Display the QR code image -->
        <img src="${imageUrl}" alt="QR Code" width="200" height="200">
        <p>To access your event ticket, scan the QR code above.</p>
        <p>If you have any questions, please feel free to contact us.</p>
      </body>
      </html>
    `;

    // Send the email
    mailSender({
      email,
      subject,
      html: emailContent
    });

    // Save the email information to the database
    await QrCodeSchema.create({
      email,
      name,
      qrUrl: imageUrl
     });

    return res.status(201).json({
      message: 'Success, check your email 😇✅'
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 'Failed!'
    });
  }
};



const confirmQrCode = async (req, res)=>{
  try {
    if (!req.body.imagePath) {
      return res.status(400).json({
        message: 'Please provide an image path.'
      });
    }

    const imageUrl = req.body.imagePath;
    const check = await QrCodeSchema.findOne({ qrUrl: imageUrl })
    if(!check) {
      res.status(400).json({
        message: 'Sorry, This ticket is Invalid'
      })
    } else {
      res.status(200).json({
        message: check
      })
    }

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}





module.exports = { sendMailCode, confirmQrCode };