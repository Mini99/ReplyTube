const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require('bcrypt');

// router.get("/", (req, res, next) => {
//     res.status(200).redirect("/");
// })

router.get("/:id", (req, res, next) => {

    var payload = {
        pageTitle: "Watch",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        urlId: req.params.id,
        endpoint: "/channels/" + req.params.id
    }

    res.status(200).render("guestUrlPage", payload);
})

module.exports = router;