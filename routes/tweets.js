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

const tweetNotFoundError = (tweetId) => {

    const err = new Error(`Tweet #${tweetId} not found.`);
    err.status = 404; // Forbidden
    next(err);
    
};

router.get('/', asyncHandler(async (req, res, next) => {
    const tweets = await Tweet.findAll()

    res.json({ tweets })
}));

router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
    const tweetId = req.params.id
    const tweet = await Tweet.findPk(tweetId)
    
    tweetNotFoundError(tweet);

    res.json({ tweet })
}));

module.exports = router