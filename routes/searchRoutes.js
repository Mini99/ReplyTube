const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const mysql = require('mysql')

router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: "Search"
    }

    res.status(200).render("search", payload);
})

module.exports = router;