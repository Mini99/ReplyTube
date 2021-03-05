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
    res.status(200).send(req.session.user.username);
})

router.get("/:id", (req, res, next) => {
    var sql = "SELECT * FROM posts WHERE urlId=?";
    con.query(sql, req.params.id, function(err, result, field){
        try {
            res.status(200).send(result);
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/:id/checkLikes", (req, res, next) => {
    var sql = "SELECT * FROM likes WHERE user=? and post=?";
    con.query(sql, [req.session.user.username, req.params.id], function(err, result, field){
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

router.post("/:content/:urlId/comment", async (req, res, next) => {

    var postData = {
        content: req.params.content,
        postedBy: req.session.user.username,
        urlId: req.params.urlId,
        profilePic: req.session.user.profilePic
    }

    var sqlInsertPost = "INSERT INTO posts (content, postedBy, urlId, profilePic) VALUES (?,?,?,?)";
    con.query(sqlInsertPost, [postData.content, postData.postedBy, postData.urlId, postData.profilePic]);

    var sqlSelectPost = "SELECT * FROM posts WHERE content=? AND postedBy=? AND urlID=? AND profilePic=?"
    con.query(sqlSelectPost, [postData.content, postData.postedBy, postData.urlId, postData.profilePic], function(err, result, field){
        try {
            res.status(200).send(result[0]);
        }
        catch {
            console.log(err);
        }
    });
})

// router.post("/", async (req, res, next) => {

//     if(!req.body.content) {
//         console.log("Content param not sent with request");
//         return res.sendStatus(400);
//     }

//     var postData = {
//         content: req.body.content,
//         postedBy: req.session.user.username,
//         urlId: req.body.urlId,
//         profilePic: req.session.user.profilePic
//     }

//     var sql = "INSERT INTO posts (content, postedBy, urlId, profilePic) VALUES (?,?,?,?)";

//     con.query(sql, [postData.content, postData.postedBy, postData.urlId, postData.profilePic], function(err, result, field){
//         try {
//             res.status(200).send(postData);
//         }
//         catch {
//             console.log(err);
//         }
//     });
// })

router.put("/:id/like", async (req, res, next) => {

    var postId = req.params.id;
    var userId = req.session.user.username;

    var sql = "SELECT * FROM likes WHERE user=? AND post=?";
    con.query(sql, [userId, postId], function(err, result, field){
        try {     
            // Case where post is liked by user       
            if(result.length > 0) {
                sqlDeleteUserLikes = "DELETE FROM likes WHERE user=? AND post=?"
                con.query(sqlDeleteUserLikes, [userId, postId]);

                var sqlUpdateLikes = "UPDATE posts SET likes=likes-1 WHERE postId=?"
                con.query(sqlUpdateLikes, postId);

                var sqlSelectLikes = "SELECT likes FROM posts WHERE postId=?"
                con.query(sqlSelectLikes, postId, function(err, result, field){
                    if(result[0].likes === 0){
                        result[0].likes = "";
                    }
                    result[0].active = 1;
                    res.status(200).send(result[0]);
                });
            }
            // Case where post is not liked by user
            else {
                sqlUserLikes = "INSERT INTO likes (user, post) VALUES (?,?)";
                con.query(sqlUserLikes, [userId, postId]);

                var sqlUpdateLikes = "UPDATE posts SET likes=likes+1 WHERE postId=?"
                con.query(sqlUpdateLikes, postId);

                var sqlSelectLikes = "SELECT likes FROM posts WHERE postId=?"
                con.query(sqlSelectLikes, postId, function(err, result, field){
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