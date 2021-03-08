const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const path = require("path");
const mysql = require('mysql')

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

router.get("/images/:path", (req, res, next) => {
    res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
})

module.exports = router;