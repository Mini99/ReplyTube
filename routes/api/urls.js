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

router.get("/likes/:id", (req, res, next) => {
    pool.query("SELECT likes FROM urls WHERE urlId='"+ req.params.id +"'", function(err, result, field){
        try {
            res.status(200).send(result);
        }
        catch {
            console.log(err);
        }
    });
})

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

router.put("/:id/like", (req, res, next) => {
    var urlId = req.params.id;
    var userId = req.session.user.username;

    var sql = "SELECT * FROM videoLikes WHERE user=? AND urlId=?";
    con.query(sql, [userId, urlId], function(err, result, field){
        try {     
            // Case where video is liked by user       
            if(result.length > 0) {
                sqlDeleteUserLikes = "DELETE FROM videoLikes WHERE user=? AND urlId=?"
                con.query(sqlDeleteUserLikes, [userId, urlId]);

                var sqlUpdateLikes = "UPDATE urls SET likes=likes-1 WHERE urlId=?"
                con.query(sqlUpdateLikes, urlId);

                var sqlSelectLikes = "SELECT likes FROM urls WHERE urlId=?"
                con.query(sqlSelectLikes, urlId, function(err, result, field){
                    result[0].active = 1;
                    res.status(200).send(result[0]);
                });
            }
            // Case where video is not liked by user
            else {
                sqlUserLikes = "INSERT INTO videoLikes (user, urlId) VALUES (?,?)";
                con.query(sqlUserLikes, [userId, urlId]);

                var sqlUpdateLikes = "UPDATE urls SET likes=likes+1 WHERE urlId=?"
                con.query(sqlUpdateLikes, urlId);

                var sqlSelectLikes = "SELECT likes FROM urls WHERE urlId=?"
                con.query(sqlSelectLikes, urlId, function(err, result, field){
                    result[0].active = 0;
                    res.status(200).send(result[0]);
                });
            }
        }
        catch {
            console.log(err);
        }
    });
})

module.exports = router;