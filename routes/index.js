var express = require('express');
var router = express.Router();
var User = require('../model/User');

// sample json model : JSON {status , msg , data , errs}

router.get('/', function(req, res, next) {
  // TODO : rendering the admin posts on the home page

  res.render('index', { title: 'Express' });
});

router.get('/login' , function (req, res, next) {

  // TODO : res.render("login" , data);
  // req.body.nameofattr
  //   req.checkBody('name',
  //       'Name field is required').notEmpty();
  //   req.checkBody('password2',
  //       'Password do not match').equals(req.body.password);
  //
  //   var errors = req.validationErrors();

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
    //   var newUser = new User({
  //       name: name,
  //       email: email,
  //       username: username,
  //       password: password,
  //       profileImage: profileImageName
  //   });
  //
  //   // Create User
  //   User.createUser(newUser, function(err, user){
  //       if(err)throw err;
  //       console.log(user);
  //   });
  if(!User.getUserByUsername(req.body.username)) {
      res.json({
          status: 200,
          msg: "request for siging up",
          data: null
      });
  }else {
      res.json({
          status: 201,
          msg: "request for siging up",
          errs : "username invalid" ,
          data: null
      });
  }
});

router.post('/loginPassport',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/users/' + req.user.username);
    });


module.exports = router;
