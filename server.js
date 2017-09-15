var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./controllers/scraperController.js");
// Set mongoose to leverage built in JavaScript ES6 Promises

var app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", routes);

app.listen(process.env.PORT || 3000, function() {
  console.log("RUNNING");
});
