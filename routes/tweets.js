const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const db = require("../db/models");
const {check } =  require("express-validator");
const { Tweet } = db;
const { tweetNotFoundError,
    handleValidationErrors,
    asyncHandler} = require('../utils')

    const validateTask = [
        //  Task name cannot be empty:
        check("message")
          .exists({ checkFalsy: true })
          .withMessage("Task name can't be empty."),
        //  Task name cannot be longer than 255 characters:
        check("name")
          .isLength({ max: 255 })
          .withMessage("Task name can't be longer than 255 characters."),
      ];

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

router.post('/', validateTask, handleValidationErrors, async (req, res) => {
    const { name } = req.body;
    const tweet = await Tweet.create({ name }) 
    res.status(201).json({ tweet })
})

router.put('/:id(\\d+)', validateTask, handleValidationErrors, asyncHandler( async (req, res, next) => {
    const tweetId = parseInt(req.params.id, 10);
    const tweet = await Tweet.findByPk(tweetId);

        if(tweet){
            await tweet.update({ message:req.body.message })
            res.json({ tweet })
        }else{
            next(tweetNotFoundError(tweetId))
        }
}))

router.delete('/:id(\\d+)', asyncHandler(async(req,res, next) => {
    const tweetId = parseInt(req.params.id, 10);
    const tweet = await Tweet.findByPk(tweetId);

    if(tweet){
        await tweet.destroy();
        res.status(204).end()
    }else{
        next(tweetNotFoundError(tweetId))
    }

}))

module.exports = router