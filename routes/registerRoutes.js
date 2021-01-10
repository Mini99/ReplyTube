const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const mysql = require('mysql');

app.set("view engine", "pug");
app.set("views", "views");


app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {

    res.status(200).render("register");
})

router.post("/", async (req, res, next) => {

    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;

    var payload = req.body;

    if(username && email && password) {
        //use db class instead
        const con = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE
        });

        var check = "SELECT * FROM users WHERE username=? or email=?";
        var user = await con.query(check, [username, email], function (err, result) {
            if (result.length != 0){
                return 1;
            }
        });

        if(user){
            var sql = "INSERT INTO users (username, email, password) VALUES (?,?,?)";
            con.query(sql, [username, email, password], function (err, result) {
            if (err) throw err;
                console.log("1 record inserted");
            });

            res.status(200).render("login");
        }
        else {
            if(email == user.email) {
                payload.errorMessage = "Email already in use.";
            }
            else {
                payload.errorMessage = "Username already in use.";
            }
            res.status(200).render("register", payload);
        }
        
        // make a close connection statement
    }
    else {
        payload.errorMessage = "Make sure each field has a valid value.";
        res.status(200).render("register", payload);
    }
})


module.exports = router;