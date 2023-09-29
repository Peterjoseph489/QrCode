require('dotenv').config();
const { RequestHandler } = require('express');
const userModel = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchemaValidation = require('../schemas/users.schema');


const registerUser = async (req, res)=>{
    try {
        const { name, email, password } = req.body;

        await userSchemaValidation.validateAsync({ name, email, password });

        const checkEmail = await userModel.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({
                message: "Email already taken!"
            })
        }

        const saltPass = await bcryptjs.genSalt(10);
        await bcryptjs.hash(password, saltPass, async (err, result)=>{
            if (err) {
                return res.status(400).json({
                  message: err.message
                })
            } else {
                const data = {
                    name,
                    email,
                    password: result
                }
                const newUser = new userModel(data);
                const generateToken = jwt.sign({
                    _id: newUser._id,
                    name: newUser.name
                }, process.env.SALT_SECT, {
                    expiresIn: '1d'
                })

                newUser.token = generateToken;
                await newUser.save();

                return res.status(201).json({
                    message: "Success!",
                    data: generateToken
                }); 
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 'Failed!'
        })
    }
};


const getOneUser = async (req, res)=>{
    try {
        const query = req.query;
        const theUser = await userModel.find(query);

        res.status(200).json({
            message: "Success",
            data: theUser
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 'Failed!'
        })
    }
};


module.exports = { registerUser, getOneUser };