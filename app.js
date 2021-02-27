const express = require('express');
const app = express();
const port = 3003;
require('dotenv').config()
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const session = require('express-session');

const server = app.listen(port, () => console.log("Server listening on port " + port));

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false
}))

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logout');
const urlRoute = require('./routes/urlRoutes');

// Api routes
const urlsApiRoute = require('./routes/api/urls');

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/urls", urlRoute);

app.use("/api/urls", urlsApiRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {

    var payload = {
        pageTitle: "ReplyTube",
        userLoggedIn: req.session.user
    }

    res.status(200).render("home", payload);
})