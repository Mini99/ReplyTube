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
    
})

router.get("/:id", (req, res, next) => {
    con.query("SELECT * FROM posts WHERE urlId='"+ req.params.id +"'", function(err, result, field){
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

    var postData = {
        content: req.body.content,
        postedBy: req.session.user.username,
        urlId: req.body.urlId,
        profilePic: req.session.user.profilePic
    }

    con.query("INSERT INTO posts (content, postedBy, urlId, profilePic) VALUES ('"+ postData.content +"', '"+ postData.postedBy +"', '"+ postData.urlId +"', '"+ postData.profilePic +"')", function(err, result, field){
        try {
            res.status(200).send(postData);
        }
        catch {
            console.log(err);
        }
    });

    
    
})

module.exports = router;