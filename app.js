//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//console.log(process.env.API_KEYS);
const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});
app.get("/register", function (req, res) {
    res.render("register");
});
app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/register", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        if (err) {
            console.log(err);

        } else {

            const user1 = User({
                email: username,
                password: hash
            });
            user1.save(function (err) {
                if (err) {
                    console.log(err);

                } else {
                    res.render("secrets");
                }
            });

        }
    });

});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;


    User.findOne({ email: username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result === true) {
                        res.render("secrets");
                    }
                });
            }
        }


    });
});



app.listen(3000, function () {
    console.log("Server started at port 3000");

});