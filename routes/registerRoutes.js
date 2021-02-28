const express = require('express');
const app = express();
require('dotenv').config()
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require('mysql')
const bcrypt = require('bcrypt');

app.set('view-engine', 'pug')
app.set("views", "views");

app.use(bodyParser.urlencoded( { extended: false }));

router.get("/", (req, res, next) => {

    res.status(200).render("register");
})

router.post("/", async (req, res, next) => {

    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;

    var user = {
        username: username,
        email: email,
        password: password,
        profilePic: "profilePic.jpg"
    }

    var payload = req.body;

    if(email && password) {
        const con = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE
        });

        var data = req.body;

        data.password = await bcrypt.hash(password, 10)

        var firstSql = "SELECT * FROM users WHERE username=? OR email=?";

        con.query(firstSql, [username, email], function(err, result, field){
            if(err){
                console.log(err);
            }
            else if(result.length === 0){
                var secondSql = "INSERT INTO users (username, email, password, profilePic) VALUES (?,?,?,?)";
                con.query(secondSql, [username, email, data.password, user.profilePic], function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    req.session.user = user;
                    return res.redirect("/");
                });
            }
            else if(result[0].username === username) {
                payload.errorMessage = "Username already in use.";
                res.status(200).render("register", payload);
            }
            else if(result[0].email === email) {
                payload.errorMessage = "Email already in use.";
                res.status(200).render("register", payload);
            }
            else {
                console.log("MySQL error");
            }
        });
    }
    else {
        res.status(200).render("register");
    }
})

module.exports = router;