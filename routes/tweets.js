const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const db = require("../db/models");
const { Tweet } = db;
const { check, validationResult } = require("express-validator");
const { route } = require('.');
const { Router } = require('express');

const asyncHandler = (handler) => {
    return (req, res, next) => {
        return handler(req, res, next).catch(next);
    };
};

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

  const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
  
    // If the validation errors are not empty,
    if (!validationErrors.isEmpty()) {
      // Generate an array of error messages
      const errors = validationErrors.array().map((error) => error.msg);
  
      // Generate a new `400 Bad request.` Error object
      // and invoke the next function passing in `err`
      // to pass control to the global error handler.
      const err = Error("Bad request.");
      err.status = 400;
      err.title = "Bad request.";
      err.errors = errors;
      return next(err);
    }
    // Invoke the next middleware function
    next();
  };
  

const tweetNotFoundError = (tweetId, next) => {

    const err = new Error({
        title: "Tweet not found.",
    });
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