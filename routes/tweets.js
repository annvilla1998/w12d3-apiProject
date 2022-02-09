const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const db = require("../db/models");
const { Tweet } = db;

const asyncHandler = (handler) => {
    return (req, res, next) => {
        return handler(req, res, next).catch(next);
    };
};

const tweetNotFoundError = (tweetId, next) => {

    const err = new Error({
        title: "Tweet not found.",
    });
    // err.errors = [`Tweet with the id of ${tweetId} does not exist`]
    err.status = 404;
    err.title =  `Tweet with the id of ${tweetId} does not exist`
    return err    
};

router.get('/', asyncHandler(async (req, res, next) => {
    const tweets = await Tweet.findAll()

    res.json({ tweets })
}));

router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const tweetId = req.params.id
    const tweet = await Tweet.findByPk(tweetId)
    // console.log(tweet)
    if(tweet){
        return res.json({ tweet })
    }else{
        next(tweetNotFoundError(tweetId));
    }
}));

module.exports = router