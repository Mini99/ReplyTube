const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');
const mysql = require('mysql')
const pool = require('../database');

router.get("/", (req, res, next) => {

    var payload = {
        pageTitle: req.session.user.username,
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        profileUser: req.session.user.username,
        profilePic: req.session.user.profilePic
    }

    res.status(200).render("profilePage", payload);
})

router.get("/:username", async (req, res, next) => {

    var sql = "SELECT * FROM users WHERE username=?";
    pool.query(sql, req.params.username, function(err, result, field){
        try {
            if(result.length > 0) {
                var payload = {
                    pageTitle: req.params.username,
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user),
                    profileUser: req.params.username,
                    profilePic: result[0].profilePic
                }
                res.status(200).render("profilePage", payload);
            }
            else {
                var payload = {
                    pageTitle: "User not found",
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user)
                }
                res.status(200).render("profilePage", payload);
            }
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/:username/likedPosts", async (req, res, next) => {

    var sql = "SELECT * FROM users WHERE username=?";
    pool.query(sql, req.params.username, function(err, result, field){
        try {
            if(result.length > 0) {
                var payload = {
                    pageTitle: req.params.username,
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user),
                    profileUser: req.params.username,
                    profilePic: result[0].profilePic,
                    selectedTab: "likedPosts"
                }
                res.status(200).render("profilePage", payload);
            }
            else {
                var payload = {
                    pageTitle: "User not found",
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user)
                }
                res.status(200).render("profilePage", payload);
            }
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/:username/replies", async (req, res, next) => {

    var sql = "SELECT * FROM users WHERE username=?";
    pool.query(sql, req.params.username, function(err, result, field){
        try {
            if(result.length > 0) {
                var payload = {
                    pageTitle: req.params.username,
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user),
                    profileUser: req.params.username,
                    profilePic: result[0].profilePic,
                    selectedTab: "replies"
                }
                res.status(200).render("profilePage", payload);
            }
            else {
                var payload = {
                    pageTitle: "User not found",
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user)
                }
                res.status(200).render("profilePage", payload);
            }
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/:username/likedReplies", async (req, res, next) => {

    // var sql = "SELECT * FROM replies INNER JOIN replylikes ON replies.replyId=replylikes.replyId WHERE replylikes.user=?";
    var sql = "SELECT * FROM users WHERE username=?";
    pool.query(sql, req.params.username, function(err, result, field){
        try {
            if(result.length > 0) {
                var payload = {
                    pageTitle: req.params.username,
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user),
                    profileUser: req.params.username,
                    profilePic: result[0].profilePic,
                    selectedTab: "likedReplies"
                }
                res.status(200).render("profilePage", payload);
            }
            else {
                var payload = {
                    pageTitle: "User not found",
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user)
                }
                res.status(200).render("profilePage", payload);
            }
        }
        catch {
            console.log(err);
        }
    });
})

router.get("/:username/likedVideos", async (req, res, next) => {

    var sql = "SELECT * FROM users WHERE username=?";
    pool.query(sql, req.params.username, function(err, result, field){
        try {
            if(result.length > 0) {
                var payload = {
                    pageTitle: req.params.username,
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user),
                    profileUser: req.params.username,
                    profilePic: result[0].profilePic,
                    selectedTab: "likedVideos"
                }
                res.status(200).render("profilePage", payload);
            }
            else {
                var payload = {
                    pageTitle: "User not found",
                    userLoggedIn: req.session.user,
                    userLoggedInJs: JSON.stringify(req.session.user)
                }
                res.status(200).render("profilePage", payload);
            }
        }
        catch {
            console.log(err);
        }
    });
})

module.exports = router;