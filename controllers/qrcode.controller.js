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


        


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};