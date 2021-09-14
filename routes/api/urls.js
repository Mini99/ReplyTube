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

router.get("/countVids", (req, res, next) => {
    pool.query("SELECT COUNT (*) AS countVids FROM urls", function(err, result, field){
        try {
            res.status(200).send(result[0]);
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/range/:start/:end", (req, res, next) => {
    pool.query("SELECT * FROM urls ORDER BY id DESC LIMIT " + req.params.start + ", " + req.params.end, function(err, result, field){
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
                pool.query("INSERT INTO urls (urlId, urlPic, likes) VALUES ('"+ urlData.urlId +"', '"+ urlData.urlPic +"', 0)", function(err, result, field){
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
                sqlUserLikes = "INSERT INTO videoLikes (user, urlId, active) VALUES (?,?, 0)";
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

router.get("/:id/checkLikes", (req, res, next) => {
    var urlId = req.params.id;
    var userId = req.session.user.username;

    var sql = "SELECT * FROM videoLikes WHERE user=? AND urlId=?";
    pool.query(sql, [userId, urlId], function(err, result, field){
        try {
            if(result.length > 0) {
                res.status(200).send(result);
            }
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/:replyId/checkReplyLikes", (req, res, next) => {
    var replyId = req.params.replyId;
    var userId = req.session.user.username;

    var sql = "SELECT * FROM replyLikes WHERE user=? AND replyId=?";
    pool.query(sql, [userId, replyId], function(err, result, field){
        try {
            if(result.length > 0) {
                res.status(200).send(result);
            }
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/:id/checkReplyLikes/profile", (req, res, next) => {
    var sql = "SELECT * FROM replies INNER JOIN replylikes ON replies.replyId=replylikes.replyId WHERE replylikes.user=? and replylikes.replyId=?";
    pool.query(sql, [req.session.user.username, req.params.id], function(err, result, field){
        try {
            if(result.length > 0) {
                res.status(200).send("1");
            }
            else {
                res.status(200).send("0");
            }
        }
        catch {
            console.log(err);
        }
    });
})

router.post("/reply", (req, res, next) => {
    postId = req.body.postId;
    content = req.body.content;
    postedBy = req.body.postedBy;
    urlId = req.body.urlId;
    profilePic = req.body.profilePic;
    likes = req.body.likes;

    var sql = "INSERT INTO replies (postId, content, postedBy, urlId, profilePic, likes) VALUES (?, ?, ?, ?, ?, ?)";
    pool.query(sql, [postId, content, postedBy, urlId, profilePic, likes], function(err, result, field){
        try {
            var replyData = {
                postId: postId,
                content: content,
                postedBy: postedBy,
                urlId: urlId,
                profilePic: profilePic,
                likes: likes
            }
            res.status(200).send(replyData);
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/replies/:urlId/:postId", (req, res, next) => {
    var urlId = req.params.urlId;
    var postId = req.params.postId;

    var sql = "SELECT * FROM replies WHERE urlId=? and postId=? ORDER BY timestamp ASC";
    pool.query(sql, [urlId, postId], function(err, result, field){
        try {
            if(result.length > 0) {
                res.status(200).send(result);
            }
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/checkReplies/:urlId", (req, res, next) => {
    var urlId = req.params.urlId;

    var sql = "SELECT postId FROM replies WHERE urlId=?";
    pool.query(sql, urlId, function(err, result, field){
        try {
            if(result.length > 0) {
                res.status(200).send(result);
            }
        }
        catch {
            console.log(err);
        }
    });
})

router.delete("/deleteReply/:id/:postId", async (req, res, next) => {
    var sql = "SELECT * FROM replies INNER JOIN replyLikes ON replies.replyId=replyLikes.replyId AND replies.postedBy=replyLikes.user WHERE replies.replyId=?";
    pool.query(sql, req.params.id, function(err, result, field){
        try {
            if(result.length > 0) {
                pool.query("DELETE FROM replies WHERE replyId=?", req.params.id);
                pool.query("DELETE FROM replyLikes WHERE replyId=?", req.params.id);
            }
            else {
                pool.query("DELETE FROM replies WHERE replyId=?", req.params.id);
            }

            var checkReplies = "SELECT COUNT (*) as countReplies FROM replies WHERE postId=?";
            pool.query(checkReplies, req.params.postId, function(err, resultCount, field){
                res.status(200).send(resultCount);
            });
        }
        catch {
            console.log(err);
        }
    });
})

router.put("/:replyId/replyLike", async (req, res, next) => {

    var replyId = req.params.replyId;
    var userId = req.session.user.username;

    var sql = "SELECT * FROM replyLikes WHERE user=? AND replyId=?";
    con.query(sql, [userId, replyId], function(err, result, field){
        try {     
            // Case where reply is liked by user       
            if(result.length > 0) {
                sqlDeleteUserLikes = "DELETE FROM replyLikes WHERE user=? AND replyId=?"
                con.query(sqlDeleteUserLikes, [userId, replyId]);

                var sqlUpdateLikes = "UPDATE replies SET likes=likes-1 WHERE replyId=?"
                con.query(sqlUpdateLikes, replyId);

                var sqlSelectLikes = "SELECT likes FROM replies WHERE replyId=?"
                con.query(sqlSelectLikes, replyId, function(err, result, field){
                    result[0].active = 1;
                    res.status(200).send(result[0]);
                });
            }
            // Case where reply is not liked by user
            else {
                sqlUserLikes = "INSERT INTO replyLikes (user, replyId, active) VALUES (?,?, 0)";
                con.query(sqlUserLikes, [userId, replyId]);

                var sqlUpdateLikes = "UPDATE replies SET likes=likes+1 WHERE replyId=?"
                con.query(sqlUpdateLikes, replyId);

                var sqlSelectLikes = "SELECT likes FROM replies WHERE replyId=?"
                con.query(sqlSelectLikes, replyId, function(err, result, field){
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

router.get("/:postedBy/replies", async (req, res, next) => {
    var postedBy = req.params.postedBy;

    var sql = "SELECT * FROM replies WHERE postedBy=? ORDER BY timestamp";
    con.query(sql, postedBy, function(err, result, field){
        try {     
            res.status(200).send(result);
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/:postedBy/likedReplies", async (req, res, next) => {
    var postedBy = req.params.postedBy;

    var sql = "SELECT * FROM replies INNER JOIN replyLikes ON replies.replyId=replyLikes.replyId WHERE postedBy=? ORDER BY replies.timestamp";
    con.query(sql, postedBy, function(err, result, field){
        try {     
            res.status(200).send(result);
        }
        catch {
            console.log(err);
        }
    });
})

module.exports = router;