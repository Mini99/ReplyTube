const express = require('express');
const app = express();
require('dotenv').config()
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require('mysql')
const bcrypt = require('bcrypt');
const path = require('path')
const pool = require('../database');

app.set('view-engine', 'pug')
app.set("views", "views");

app.use(bodyParser.urlencoded( { extended: false }));

router.get("/", (req, res, next) => {

    res.status(200).render("login");
})

router.post("/", (req, res, next) => {

    var user = {
        username: req.body.logUsername,
        email: null,
        profilePic: null
    }

    if(req.body.logUsername === "") {
        payload.errorMessage = "Username or email can't be empty.";
        res.status(200).render("register", payload);
    }

    var payload = req.body;

    if(req.body.logUsername && req.body.logPassword) {

        pool.query("SELECT * FROM users WHERE username='"+ req.body.logUsername +"' OR email='"+ req.body.logUsername +"'", async function(err, result, field){
            if(result.length > 0){
                var comp = await bcrypt.compare(req.body.logPassword, result[0].password);
                if(comp === true) {
                    user.email = result[0].email;
                    user.username = result[0].username;
                    user.profilePic = result[0].profilePic;
                    req.session.user = user;
                    return res.redirect("/");
                }
                else {
                    payload.errorMessage = "Incorrect Password.";
                    return res.status(200).render("login", payload);
                }
            }
            else {
                payload.errorMessage = "User does not exist.";
                return res.status(200).render("login", payload);
            }
        });
    }
    else {
        return res.redirect("login");
    }
})

module.exports = router;