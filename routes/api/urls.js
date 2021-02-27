const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const mysql = require('mysql')

app.use(bodyParser.urlencoded({ extended: false }));

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

router.get("/", (req, res, next) => {
    con.query("SELECT * FROM urls", function(err, result, field){
        try {
            res.status(200).send(result);
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/:id", (req, res, next) => {
    con.query("SELECT * FROM posts WHERE urlId='"+ id +"'", function(err, result, field){
        try {
            console.log(result);
            // res.status(200).send(result);
        }
        catch {
            console.log(err);
        }
    });
})

router.post("/", async (req, res, next) => {

    if(!req.body.content) {
        console.log("Content param not sent with request");
        return res.sendStatus(400);
    }

    var urlData = {
        urlId: req.body.content,
        urlPic: req.body.thumbnail
    }

    con.query("SELECT * FROM urls WHERE urlId='"+ urlData.urlId +"'", function(err, result, field){
        try {
            if(result.length === 0) {
                con.query("INSERT INTO urls (urlId, urlPic) VALUES ('"+ urlData.urlId +"', '"+ urlData.urlPic +"')", function(err, result, field){
                    try {
                        res.status(200).send(result);
                    }
                    catch {
                        console.log(err);
                    }
                });
            }
        }
        catch {
            console.log(err);
        }
    });

    
    
})

module.exports = router;