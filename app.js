const express = require("express");
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path")
const app = express();
const dotenv = require('dotenv');
dotenv.config();

//handlebars engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Static folder
app.use('/public', express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.render("home")
})

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;



    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "myresume.contactme@gmail.com", // generated ethereal user
            pass: "myresume-12345"// generated ethereal password
        },

    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"My Resume" <MyResume@gmail.com>', // sender address
        to: 'george95.2621@gmail.com', // list of receivers
        subject: 'My Resume Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('home', { msg: 'Email has been sent' });
    });
})



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server started on port 3000"))