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
        profileUser: req.session.user
    }

    res.status(200).render("profilePage", payload);
})

router.get("/:username", async (req, res, next) => {

    var payload = await getPayload(req.params.username, req.session.user.username);

    res.status(200).render("profilePage", payload);
})

async function getPayload(username, userLoggedIn) {
    var user = await con.query("SELECT username FROM users WHERE username=?", username);
    user = user.values;
    if(user === 0) {
        return {
            pageTitle: "User not found",
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(req.session.user)
        }
    }
    else {
        return {
            pageTitle: user,
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
            profileUser: username
        }
    }
}

module.exports = router;