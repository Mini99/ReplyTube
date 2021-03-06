const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const mysql = require('mysql')

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user.username,
        profilePic: req.session.user.profilePic
    }

    res.status(200).render("profilePage", payload);
})

router.get("/:username", async (req, res, next) => {

    var sql = "SELECT * FROM users WHERE username=?";
    con.query(sql, req.params.username, function(err, result, field){
        try {
            if(result.length > 0) {
                var payload = {
                    pageTitle: req.params.username,
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user),
                    profileUser: req.params.username,
                    profilePic: result[0].profilePic
                }
                res.status(200).render("profilePage", payload);
            }
            else {
                var payload = {
                    pageTitle: "User not found",
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user)
                }
                res.status(200).render("profilePage", payload);
            }
        }
        catch {
            console.log(err);
        }
    });

    
})

module.exports = router;