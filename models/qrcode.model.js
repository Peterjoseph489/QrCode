const mongoose = require('mongoose');

const qrcodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Qr Email is required!'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Qr Name is required!']
    },
    qrcode: {
        type: String
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

const QrCodeSchema = mongoose.model('qrcode', qrcodeSchema);

module.exports = QrCodeSchema;