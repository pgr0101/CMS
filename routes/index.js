var express = require('express');
var router = express.Router();

// TODO : JSON {status , msg , data}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login' , function (req, res, next) {

  // TODO : res.render("login" , data);

});

router.post('/login' , function (req, res, next) {
  // TODO : authentication and sending json
  // if the user is admin the abilities are different
  res.json({status : 200 ,
            msg : "login request" ,
            data : null});
});

router.get('/signup' , function (req, res, next) {
  // TODO : res.render("signup" , data)

});

router.post('/signup' , function (req, res , next) {
  // TODO : adding a user and mongoose

  res.json({status : 200 ,
            msg : "request for siging up",
            data : null});
});

module.exports = router;
