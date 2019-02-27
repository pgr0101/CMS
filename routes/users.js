var express = require('express');
var router = express.Router();
var User = require("../model/User");
var Post = require("../model/Post");


router.get('/post' , function (req, res, next) {
  // TODO res.render("post" , data )
  let flag = User.canSignIn(
    req.session.userName , req.session.password);
  if(flag){
    User.getPosts(req.session.userName ,
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
});

router.post('/post' , function (req, res, next) {
  // TODO saving post in mongoose
  let flag = User.getUserByUsername(
    req.session.userName , function(err , user){
      let flag = User.comparePass(req.session.password , user.password);
          if (flag) {
              let post = new Post({
                  title: req.body.title,
                  author: req.session.userName,
                  text : req.body.text,
                  imagesUrl: req.body.imagesUrl
              });
              Post.save(post, function(err, post) {
                  if (err) {
                      res.json({ status: 406, msg: "didn't save post", error: err });
                  } else {
                      User.addPost(req.session.userName, post.id, function(err) {
                          if (err) {
                              res.json({
                                  status: 406,
                                  msg: "didn't save post",
                                  error: err
                              });
                          } else {
                              res.json({
                                  status: 200,
                                  msg: "post saved",
                                  data: post
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
      });
});

router.post('/like' , function (req, res, next) {
  // TODO : adding a like of a post in mongoose
  User.getUserByUsername(req.session.username , function(err , user){
    let flag = User.comparePass(req.session.password , user.password);
      if(flag){
          Post.like(req.session.userName , req.body.postID ,
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
  });

});

router.post('/comment' , function (req, res, next) {
  // TODO : adding a comment to post
    User.getUserByUsername(req.session.username , function(err , user){
        let flag = User.comparePass(req.session.password , user.password);
        if(flag){
            Post.comment(req.body.postID , req.session.userName ,
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
    });


});

router.delete("/post", function(req, res) {
  // TODO delete the post with postid from req.body.postID
  // check the session before
    User.getUserByUsername(req.session.username , function(err , user){
        let flag = User.comparePass(req.session.password , user.password);

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
    });
});

router.post("/changeprofile", function(req, res) {
    User.getUserByUsername(req.session.username , function(err , user){
        let flag = User.comparePass(req.session.password , user.password);

        if(flag){
            let user = User
                .getUserByUsername(req.session.userName);
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
    });
});


module.exports = router;
