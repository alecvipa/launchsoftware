require('dotenv').config();

// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const email = process.env.email;
const superSecretPwd = process.env.superSecretPwd;

// Create an instance of the express app.
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 3000;

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Redirect to https://xyncs.com
const targetBaseUrl = 'https://www.launchsoftware.com.mx/inicio';



// Routes
app.get('/', function (req, res) {
    res.redirect(targetBaseUrl);
    // res.render('inicio');
});
app.get('/:params?', function (req, res) {
    var params = req.params.params;
    res.render(params);
});

// Nodemailer route

app.post("/ajax/email", function (request, response) {
    console.log(email);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
            user: email,
            pass: superSecretPwd
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    var htmlBody = `<h2>Contacto</h2><p>Nombre: ${request.body.name} </p><p> Correo electrónico: <a href='mailto: ${request.body.email}'>${request.body.email}</a></p><p>Número de contacto:${request.body.number} </p>`;
    var mail = {
        from: '"Team: Xyncs Web Studio',
        to: 'clientes@launchsoftware.com.mx',
        subject: '¡Alguien ha dejado sus datos en Launch Software!',
        html: htmlBody
    };
    transporter.sendMail(mail, function (err, info) {
        if (err) {
            return console.log(err);
        } else {
            console.log("message sent!");
        };
    });
});


// Start our server so that it can begin listening to client requests.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});