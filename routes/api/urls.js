const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const mysql = require('mysql')
const pool = require('../../database');

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    pool.query("SELECT * FROM urls", function(err, result, field){
        try {
            res.status(200).send(result);
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

    pool.query("SELECT * FROM urls WHERE urlId='"+ urlData.urlId +"'", function(err, result, field){
        try {
            if(result.length === 0) {
                pool.query("INSERT INTO urls (urlId, urlPic) VALUES ('"+ urlData.urlId +"', '"+ urlData.urlPic +"')", function(err, result, field){
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