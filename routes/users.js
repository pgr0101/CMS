var express = require('express');
var router = express.Router();

router.get('/post' , function (req, res, next) {
  // TODO res.render("post" , data )

});

router.post('/post' , function (req, res, next) {
  // TODO saving post in mongoose

  res.json({status : 200 ,
    msg : "post request",
    data : null});
});

router.post('/like' , function (req, res, next) {
  // TODO : adding a like of a post in mongoose

  res.json({status : 200 ,
            msg : "like request for post",
            data : null});
});

router.post('/comment' , function (req, res, next) {
  // TODO : adding a comment to post

  res.json({status : 200 ,
            msg : "request for commenting on a post",
            data : null});
});



module.exports = router;
