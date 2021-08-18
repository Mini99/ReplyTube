const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const mysql = require('mysql')
const fs = require("fs");
const multer = require("multer");
const path = require('path');
const upload = multer({ dest: "uploads/" });
const pool = require('../../database');

app.use(bodyParser.urlencoded({ extended: false }));

router.post("/profilePicture", upload.single("croppedImage"), (req, res, next) => {

    if(!req.file) {
        console.log("No file uploaded with ajax request.")
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, error => {
        if(error != null) {
            console.log(error);
            return res.sendStatus(400);
        }

        pool.query("UPDATE posts SET profilePic=? WHERE postedBy=?", [filePath, req.session.user.username]);
        var sqlUsers = "UPDATE users SET profilePic=? WHERE username=?";
        pool.query(sqlUsers, [filePath, req.session.user.username], function(err, result, field){
            try {
                req.session.user.profilePic = filePath;
                res.sendStatus(204);
            }
            catch {
                console.log(err);
            }
        });
    });
});


module.exports = router;