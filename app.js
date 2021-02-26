const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const session = require('express-session');

const server = app.listen(port, () => console.log("Server listening on port " + port));

app.get("/", (req, res, next) => {

})