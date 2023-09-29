const express = require('express');
const { getOneUser, registerUser } = require('../controllers/users.controller');
const { sendMailCode, confirmQrCode } = require('../controllers/qrcode.controller');

const userRoute = express.Router();

userRoute.route('/user').post(registerUser);
userRoute.route("/user").get(getOneUser);
userRoute.route("/code").post(sendMailCode);
userRoute.route("/details").post(confirmQrCode);

module.exports = userRoute;