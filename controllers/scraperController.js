var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");
var mongoose = require("mongoose");
mongoose.Promise = Promise;

mongoose.connect("mongodb://heroku_xn5cdw13:ni650cr164oofqvmjvj6qql8j0@ds137197.mlab.com:37197/heroku_xn5cdw13");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function()
{
  console.log("Mongoose connection successful.");
});

router.get("/scrape", function(req, res)
{
  request("https://www.nytimes.com/?mcubz=0", function(error, response, html) {
    var $ = cheerio.load(html);
    $(".story").each(function(i, element) {
      var result = {};
      result.title = $(this).children().children("a").text().trim();
      result.link = $(this).children().children("a").attr("href");
      result.summary = $(this).children(".summary").text().trim();
      console.log(result);
      var entry = new Article(result);
      entry.save(function(err, data) {
        if (err)
        {
          console.log(err);
        }
        else
        {
          console.log(data);
        }
      });
    });
  });
  res.redirect("/");
});

//displays all scraped articles on front page.
router.get("/articles", function(req, res)
{
  Article.find({}).sort({_id:-1}).exec(function(err, data)
  {
    if(err) return err;
    res.json(data);
  });
});

//gets articles by id to display associated comments
router.get("/articles/:id", function(req, res) {

  Article.findById(req.params.id)
         .populate("comment").exec(function(err, data)
  {
    if(err) return err;
    console.log(data);
    res.json(data);
  });
});

//route to create comment
router.post("/createNote/:id", function(req, res)
{
  var note = new Note(req.body);
  note.save(function(err, data)
  {
    Article.findOneAndUpdate({_id: req.params.id}, {$set: {comment:data._id}}, {new:true}, function(error, artData)
    {
      if(error) return error;
      res.send(artData);
    });
  });
});

//retrieves saved articles
router.get("/getSavedArticles/", function(req, res)
{
  Article.find({saved: true}, function(err, data)
  {
    if(err) return err;
    res.json(data);
  });
});

//saving articles
router.post("/saveArticle/:id", function(req, res)
{
  Article.findOneAndUpdate({_id: req.params.id},
    {$set:{saved: true}}, {new:true}, function(err, data)
    {
      if(err) return err;
      res.send("article saved");
    });
});

router.post("/deleteArticle/:id", function(req, res)
{
  Article.findOneAndUpdate({_id: req.params.id},
    {$set:{saved: false}}, {new:true}, function(err, data)
    {
      if(err) return err;
      res.redirect("/index.html");
    });
});

module.exports = router;
