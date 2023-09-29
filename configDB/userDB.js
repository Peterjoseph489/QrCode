require('dotenv').config();
const mongoose = require('mongoose');

const USERNAME = process.env.USERNAME_DB;
const PASSWORD = process.env.PASSWORD_DB;

const url = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.elo4wzd.mongodb.net/`

mongoose.connect(url).then(()=>{
    console.log('Database connected successfully.')
}).catch(()=>{
    console.log('Database disconnected.')
});