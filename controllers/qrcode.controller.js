const qrCode = require('qrcode');
const fs = require('fs');
const { Content } = require('mailgen');
const generateMail = require('../middlewares/genTemplate');
const mailSender = require('../middlewares/mail');
const QrCodeSchema = require('../models/qrcode.model');
const Cloudinary = require('cloudinary');
const e = require('express-fileupload');


const sendMailCode = async (req, res)=>{
    try {
        const { email, name } = req.body;
        const qrImage = await qrCode.toDataURL(email);
        console.log(qrImage)
        
        // convert the Data URL to a buffer
        const qrCodeString = qrImage.split(',')[1];
        console.log(qrCodeString);

        // Upload the QR code image to cloudinary
        const result = await Cloudinary.UploadStream.upload(qrImage, {
            folder: 'qr_codes',
            public_id: 'my_qr_code'
        })


        const image = result.secure_url
        const subject = "Ticket QR Code!"
        mailSender({
            email,
            subject,
            html: `<
  
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Event Ticket with QR Code</title>
            </head>
            <body>
                <h1>Welcome to Your Event Booking App</h1>
                <p>Hello ${name} </p>
                <p>Your event ticket is attached as a QR code:</p>
                <!-- Display the QR code image -->
                <img src="data:image/png;base64, ${image} " alt="QR Code" width="200" height="200">
                <p>To access your event ticket, scan the QR code above.</p>
                <p>If you have any questions, please feel free to contact us.</p>
            </body>
            </html>
            `
        })

        await QrCodeSchema.create({ email, name });

        return res.status(201).json({
            message: 'Success, check your email 😇✅'
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 'Failed!'
        })
    }
};


module.exports = sendMailCode;