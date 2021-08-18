const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const mysql = require('mysql')

router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: "Channels",
        userLoggedInJs: JSON.stringify(req.session.user.username)
    }

    res.status(200).render("channels", payload);
})

module.exports = router;