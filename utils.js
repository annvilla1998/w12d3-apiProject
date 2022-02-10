
const { check, validationResult } = require("express-validator");

const asyncHandler = (handler) => {
    return (req, res, next) => {
        return handler(req, res, next).catch(next);
    };
};


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


module.exports = {
    tweetNotFoundError,
    handleValidationErrors,
    asyncHandler
}