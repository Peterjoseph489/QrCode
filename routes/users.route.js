const express = require('express');
const { getOneUser, registerUser } = require('../controllers/users.controller');
const { sendMailCode } = require('../controllers/qrcode.controller');

const userRoute = express.Router();

userRoute.route('/user').post(registerUser);
userRoute.route("/user").get(getOneUser);
userRoute.route("/code").post(sendMailCode);

module.exports = userRoute;