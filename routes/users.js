var express = require('express');
var router = express.Router();
var User = require("../model/User");
var Post = require("../model/Post");

// request url : domain.com/users/post , return response : {status , msg , data :{user's.posts{title , text , images , comments(username@text) , likes , likers}}}
router.get('/post' , function (req, res, next) {
  // TODO res.render("post" , data )
  User.getUserByusername(req.session.username , function(err , user){
      if(!err){
          let flag = User.comparePass(req.session.password , user.password);
          if(flag){
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
              res.json({
                  status : 403,
                  msg : "forbidden. no access" ,
                  data : null
              })
          }
      }else{
          console.log(err);
          res.json({
             status : 406 ,
             msg : "error occurred"
          });
      }
  });
});

// for sending posts json(title , username , text , imagesUrl) returns json(status , msg)
router.post('/post' , function (req, res, next) {
  // TODO saving post in mongoose
  User.getUserByusername(req.session.username , function(err , user){
      if(!err){
        let flag = User.comparePass(req.session.password , user.password);
        if (flag) {
              let post = new Post({
                  title: req.body.title,
                  author: req.session.username,
                  text : req.body.text
              });
              post.imagesUrl.push(req.body.imagesUrl);
              Post.savePost(post , function(err, post) {
                  if (err) {
                      console.log(err);
                      res.json({ status: 406, msg: "didn't save post" });
                  } else {
                      User.addPost(req.session.username, function(err , user) {
                          if (err) {
                              console.log(err);
                              res.json({
                                  status: 406,
                                  msg: "didn't save post",
                              });
                          } else {
                              user.posts.push(post.id);
                              user.save(function(err){
                                  if(err){
                                      console.log(err);
                                      res.json({
                                          status: 406,
                                          msg: "post didn't save",
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
          } else {
              res.json({
                  status: 403,
                  msg: "forbidden. no access"
              });
          }
      }else{
          console.log(err);
          res.json({
             status : 406 ,
             msg : "error occurred"
          });
      }
      });
});

// sending json(postID , username of liker)  , returns json(status , msg)
router.post('/like' , function (req, res, next) {
  // TODO : adding a like of a post in mongoose
  User.getUserByusername(req.session.username , function(err , user){
    let flag = User.comparePass(req.session.password , user.password);
    if(!err){
        if(flag){
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
                })
        }else{
            res.json({
                status : 403 ,
                msg : "forbidden. no access",
                data : null
            })
        }
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
        let flag = User.comparePass(req.session.password , user.password);
        if(flag){
            Post.comment(req.body.postID , req.session.username ,
                req.body.text , function(err){
                    if(err){
                        res.json({
                            status : 406 ,
                            msg : "error occurred",
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
            res.json({
                status : 403,
                msg : "forbidden. no access",
                data : null
            })
        }
    }else{
        console.log(err);
        res.json({
            status : 406,
            msg : "error occurred"
        })
    }
    });


});

// sending json(postID) returns json(status , json) domain.com/users/delete
router.delete("/post", function(req, res) {
  // TODO delete the post with postid from req.body.postID
  // check the session before
    User.getUserByusername(req.session.username , function(err , user){
        let flag = User.comparePass(req.session.password , user.password);
        if(!err){
            if (flag) {
                Post.remove(req.body.postID, function(err) {
                    if (err) {
                        res.json({
                            status: 406,
                            msg: "didn't delete post",
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
            } else {
                res.json({
                    status: 403,
                    msg: "forbidden , no access",
                    data: null
                });
            }
        }else{
            console.log(err);
            res.json({
                status : 406,
                msg : "error occurred"
            })
        }
    });
});


router.post("/changeprofile", function(req, res) {
    User.getUserByusername(req.session.username , function(err , user){
        if(!err){
            let flag = User.comparePass(req.session.password , user.password);
            if(flag){
                let user = User
                    .getUserByusername(req.session.username);
                user.profileImage = req.body.profile;
                user.save(function(err , user){
                    res.json({
                        status : 200,
                        msg : "changed successfully",
                        data : user
                    });
                });
            }else{
                res.json({
                    status : 403 ,
                    msg : "forbidden. no access" ,
                    data : null
                });
            }
        }else{
            console.log(err);
            res.json({
                status : 406 ,
                msg : "error occurred"
            })
        }
    });
});

// adding a post to savedPosts send json(postID) , returns json(msg , status)
router.post('/addtosavedpost' , function(req , res , next) {
    User.getUserByusername(req.session.username , function(err , user){
        if(!err){
            let flag = User.comparePass(req.session.password , user.password);
            if(flag){
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
                res.json({
                    status : 403 ,
                    msg : "forbidden. no access" ,
                    data : null
                });
            }
        }else{
            console.log(err);
            res.json({
                status : 406 ,
                msg : "error occurred"
            })
        }
    });
});



// verification on working and for sellers and buying ... 

router.post('/verify' , function(req , res , next){
    // TODO verification 
    // first generate a random number and send that to the phonenumber 
    // then check the code and not giving access till verification
});

module.exports = router;



