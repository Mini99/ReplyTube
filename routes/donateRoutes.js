const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const mysql = require('mysql')

router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: "Donate"
    }

    res.status(200).render("donate", payload);
})

module.exports = router;