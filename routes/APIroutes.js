const express = require('express');
const router = express.Router();
const db = require("../models");
const axios = require('axios');
const cheerio = require('cheerio');

router.get("/api/scrape", function(re,res) {
    axios.get("https://www.theringer.com/").then(function(response) {
        let article = {};
        let $ = cheerio.load(response.data);
        $(".c-entry-box--compact__title").each(function(i,element) {
            article.title = $(element).children("a").text();
            article.url = $(element).children("a").attr("href");
            article.summary = $(element).children("p").text();
            article.saved = false;
            if (article.title && article.url) {
                db.Article.create(article).then(function(dbArticle){
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                })
            }
        });
    });
});

router.get("api/articles", function(req,res) {
    db.Article.find({ "saved": false}).then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

router.put("api/articles/:id", function(req,res) {
    db.Article.findOneAndUpdate(
        { id: req.params.id},
        { $set: {saved: true}}
    ).then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

router.get("api/articles/saved", function(req,res) {
    db.Article.find({"saved": true}).then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

router.get("api/articles/saved/:id", function(req,res) {
    db.Article.findOneAndUpdate(
        {id: req.params.id},
        {$set: {saved:false}}
    ) .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

router.get("api/articles/saved/:id", function(req,res){
    db.Comment.create(req.body).then(function(dbComment) {
        return db.Article.findOneAndUpdate(
            {id: req.params.id},
            {comment: dbComment.id},
            {new: true}
        )
    }).then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

module.exports = router;