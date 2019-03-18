var express = require("express");
var router = express.Router();
var User = require("../model/User");
var Post = require("../model/Post");
const { check, validationResult } = require('express-validator/check');

// url : domain.com/admin/..

function isAdmin(username , password){
    let answer = false;
    User.getUserByusername(username , function(err , user){
        let flag = User.comparePass(password , user.password);
        if(flag){
            answer = user.isAdmin;
        }
    });
    return answer;
};


router.post("/post", function(req, res, next) {
  // TODO saving post
  let flag = isAdmin(
    req.session.username , req.session.password);
  if (flag) {
    let post = new Post({
      title: req.body.title,
      author: req.session.username,
      text : req.body.text,
      imagesUrl: req.body.imagesUrl
    });
    Post.save(post, function(err, post) {
      if (err) {
        res.json({ status: 406, msg: "didn't save post", error: err });
      } else {
        User.addPost(req.session.username, post.id, function(err) {
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

router.delete("/post", function(req, res) {
  // TODO delete the post with postid from req.body.postID
  // check the session before
  let flag = isAdmin(
      req.session.username , req.session.password);
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


router.post("/changeprofile", function(req, res) {
  let flag = isAdmin(
      req.session.username , req.session.password);
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
});



// deleteing users and their posts and seller and products
/**
 * thinking about admin options and working on that
 * */ 


module.exports = router;



 