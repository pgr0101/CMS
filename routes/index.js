var express = require('express');
var router = express.Router();
var User = require('../model/User');
var Post = require('../model/Post');

// sample json model : JSON {status , msg , data , errs}

// for rendering index.html of vue
router.get('/', function(req, res, next) {
  res.render('index');
});

// an array of posts(json) has date for sorting domain.com/posts
router.get('/posts' , function(req , res){
  Post.postsOnTop(function(err , posts){
      if(err){
        res.json({
          status : 406 ,
          msg : "an error ocurred",
          error : err ,
          data : null
        });
      }else {
        console.log("res done");
        res.json({
          status : 200 ,
          msg : "found some posts" ,
          data : posts ,
          username : req.session.username
        });
    }

    });
});

// req sending json(userName , password) , returns json(status , msg , data(username , Email , phoneNumber , imageUrl))
router.post('/login' , function (req, res, next) {
    User.getUserByUsername(req.body.username ,function(err , user){
        if(!err){
            let flag = User.comparePass(req.body.password , user.password);
            if(flag){
              try {
                  req.session.username = req.body.userName;
                  req.session.password = req.body.password;
              }catch(e){
                  console.log(e);
              }
              if(user.isAdmin){
                    res.json({
                        status : 200 ,
                        msg : "welcome admin" ,
                        data : {
                            isAdmin : true
                        }
                    });
                }else{
                    console.log("res done");
                    res.json({
                        status : 200 ,
                        msg : "welcome user" ,
                        data : {
                          username : user.username ,
                          email : user.Email ,
                          phone : user.phoneNumber ,
                          imageUrl : user.profileImage
                        }
                    });
                }
            }else{
                res.json({
                    status : 401 ,
                    msg : "auth problem username or password wrong" ,
                    data : null
                })
            }
        }else{
            console.log(err);
            res.json({
                status : 400 ,
                msg : "error occurred",
            });
        }
    });
});

// request for signing up sending a json(userName , password , Email , phoneNumber) , returning json(status , msg , data :userName , Email , phoneNumber , profileImage)
router.post('/signup' , function (req, res , next) {
  let user = new User({
    username : req.body.userName ,
    Email : req.body.Email ,
    phoneNumber : req.body.phoneNumber ,
    password : req.body.password 
  //  profileImage : (req.body.profile != null ? req.body.profile : null)
  });
  User.register(user , function(err , user){
    if(err){
        console.log(err);
      res.json({
        status : 406,
        msg : "Not acceptable data",
        data : null
      });
    } else if(user){
      res.json({
        status : 200 ,
        msg : "user saved" ,
        data : {
          userName : user.username ,
          Email : user.Email ,
          phoneNumber : user.phoneNumber
        }
      });
    }
  });
});

// return a json(status , msg)
router.post('/logout' , function(req , res){
  req.session.username = undefined;
  req.session.password = undefined;
  res.json({
      status : 200 ,
      msg  : "logged out"
  });
});

module.exports = router;


/*
200 OK
201 CreatedAccepted
204 No Content
304 Not Modified
400 Bad Request
401 Unauthorized
402 Payment Required
403 Forbidden
406 Not Acceptable
500 Internal Server Error
*/

/*
router.post('/loginPassport',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/users/' + req.user.username);
    });
*/

