require('./configDB/userDB');
const userRoute = require('./routes/users.route');

require('dotenv').config();
const express = require('express');
const exphbs = require('nodemailer-express-handlebars');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use("/api", userRoute)

app.use(fileUpload({
  useTempFiles: true
}));
// app.set('view engine', 'handlebars');

app.listen(PORT, ()=>{
    console.log(`This server is connected on Port: ${PORT}`)
});