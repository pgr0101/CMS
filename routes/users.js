var express = require('express');
var router = express.Router();
var User = require("../model/User");
var Post = require("../model/Post");
var sms = require("../services/sms");
const { check, validationResult } = require('express-validator/check');


// request url : domain.com/users/post , return response : {status , msg , data :{user's.posts{title , text , images , comments(username@text) , likes , likers}}}
router.get('/post' , function (req, res, next) {
  User.getUserByusername(req.session.username , function(err , user){
      if(!err){
        User.getPosts(req.session.username ,
            function(err , user){
                if(err){
                    res.json({
                        status : 406 ,
                        msg : "error occurred try later",
                        error : err,
                        data : null
                    })
                }else{
                    res.json({
                        status : 200 ,
                        msg : "found your posts" ,
                        data : user.posts
                    })
                }
            });          
      }else{
          console.log(err);
          res.json({
             status : 400 ,
             msg : "error occurred or user not found"
          });
      }
  });
});

// for sending posts json(title , username , text , imagesUrl) returns json(status , msg)
router.post('/post' , function (req, res, next) {
  // TODO saving post in mongoose
  User.getUserByusername(req.session.username , function(err , user){
      if(!err){
        let post = new Post({
            title: req.body.title,
            author: req.session.username,
            text : req.body.text
        });
        post.imagesUrl.push(req.body.imagesUrl);
        Post.savePost(post , function(err, post) {
            if (err) {
                console.log(err);
                res.json({ 
                    status: 406, 
                    msg: "didn't save post, post problem , not acceptable" 
                });
            } else {
                User.addPost(req.session.username, function(err , user) {
                    if (err) {
                        console.log(err);
                        res.json({
                            status: 400,
                            msg: "didn't save post cause of user problem",
                        });
                    } else {
                        user.posts.push(post.id);
                        user.save(function(err){
                            if(err){
                                console.log(err);
                                res.json({
                                    status: 400,
                                    msg: "post didn't save , user problem",
                                });
                            }else{
                                res.json({
                                    status: 200,
                                    msg: "post saved",
                                    data: post
                                });
                            }
                        });
                    }
                });
            }
        });
      }else{
          console.log(err);
          res.json({
             status : 400 ,
             msg : "error occurred or user didn't found"
          });
      }
      });
});

// sending json(postID , username of liker)  , returns json(status , msg)
router.post('/like' , function (req, res, next) {
  // TODO : adding a like of a post in mongoose
  User.getUserByusername(req.session.username , function(err , user){
    if(!err){
        Post.like(req.session.username , req.body.postID ,
            function(err){
                if(err){
                    res.json({
                        status : 406,
                        msg : "error occurred",
                        error : err
                    });
                }else{
                    res.json({
                        status : 200 ,
                        msg : "post liked" ,
                        data : null
                });
            }
        });
    }else{
        console.log(err);
        res.json({
           status : 406 ,
           msg : "error occurred"
        });
    }
  });
});

// sending json(username , text , postID) returns json(status , msg) url : domain.com/users/comment
router.post('/comment' , function (req, res, next) {
  // TODO : adding a comment to post
    User.getUserByusername(req.session.username , function(err , user){
    if(!err){
        Post.comment(req.body.postID , req.session.username ,
            req.body.text , function(err){
                if(err){
                    res.json({
                        status : 406 ,
                        msg : "error occurred , not acceptable",
                        error : err
                    });
                }else{
                    res.json({
                        status : 200 ,
                        msg : "commented successfully",
                        data : null
                    });
                }
        });
    }else{
        console.log(err);
        res.json({
            status : 400,
            msg : "error occurred , user problem"
        })
    }
    });


});

// sending json(postID) returns json(status , json) domain.com/users/delete
router.delete("/post", function(req, res) {
  // TODO delete the post with postid from req.body.postID
    User.getUserByusername(req.session.username , function(err , user){
        if(!err){
            Post.remove(req.body.postID, function(err) {
                if (err) {
                    res.json({
                        status: 400,
                        msg: "didn't delete post , post problem",
                        error: err,
                        data: null
                    });
                } else {
                    res.json({
                        status: 200,
                        msg: "post deleted",
                        data: null
                    });
                }
            });
        }else{
            console.log(err);
            res.json({
                status : 400,
                msg : "error occurred , user problem"
            })
        }
    });
});


router.post("/changeprofile", function(req, res) {
    User.getUserByusername(req.session.username , function(err , user){
        if(!err){
            let user = User
                .getUserByusername(req.session.username);
            user.profileImage = req.body.profile;
            user.save(function(err , user){
                if(err){
                    res.json({
                        status : 406 ,
                        msg : "profile problem , not acceptable"
                    });
                }else{
                    res.json({
                        status : 200,
                        msg : "changed successfully",
                        data : user
                    });
                }
            });
        }else{
            console.log(err);
            res.json({
                status : 400 ,
                msg : "error occurred , user problem"
            })
        }
    });
});

// adding a post to savedPosts send json(postID) , returns json(msg , status)
router.post('/addtosavedpost' , function(req , res , next) {
    User.getUserByusername(req.session.username , function(err , user){
        if(!err){
            let user = User
                .getUserByusername(req.session.username);
            user.savedPosts.push(req.body.postID);
            user.save(function(err , user){
                res.json({
                    status : 200,
                    msg : "changed successfully",
                    data : user
                });
            });
        }else{
            console.log(err);
            res.json({
                status : 406 ,
                msg : "error occurred , user problem"
            })
        }
    });
});


// send json(code) returns json(status , msg)
router.post('/verify' , function(req , res , next){
    User.getUserByusername(req.session.username , function(err , user){
      if(!err){
        if(req.body.code == user.verifyCode){
            user.verified = true;
            user.save(function(err , user){
                if(!err){
                    res.json({
                        status : 200 , 
                        msg : "verified successfully"
                    });
                }else{
                    res.json({
                        status : 400 , 
                        msg : "couldn't verify try later"
                    });
                }
            });
        }else{
            res.json({
                status : 400 , 
                msg : "code was wrong"
            });
        }
        
      }else{
        res.json({
            status : 400 ,
            msg : "bad request user didn't found"
        });
      }
    });
});

// send nothing returns json(status , msg)
router.get('/sendCodeAgain' , function(req , res , next){ 
    User.getUserByusername(req.session.username , function(err , user){
      if(!err){
        let code = Math.seedrandom('cipher');
        user.verifyCode = code;
        user.save(function(err , user){
            if(!err){
                let answer = sms.sendVerificationCode(user.phoneNumber , user.verifyCode);
                if(answer){
                    res.json({
                        status : 200 ,
                        msg : "code sent" ,
                        data : {
                        username : user.username ,
                        Email : user.Email ,
                        phoneNumber : user.phoneNumber
                    }
                });
                }else{
                    res.json({
                        status : 406 ,
                        msg : "verification code sending problem try later" ,
                    });
                }
            }else{
                res.json({
                    status : 400 ,
                    msg : "problem with verification code" ,
                });
            }
        });
      }else{
        res.json({
          status : 400 ,
          msg : "bad request user didn't found" ,
          data : {
            username : user.username ,
            Email : user.Email ,
            phoneNumber : user.phoneNumber
          }
        });
      }
    });
});


module.exports = router;

 

 