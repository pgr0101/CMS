var express = require("express");
var router = express.Router();
var User = require("../model/User");
var Post = require("../model/Post");

function isAdmin(username , password){
    let answer = false;
    User.getUserByUsername(username , function(err , user){
        let flag = User.comparePass(password , user.password);
        if(flag){
            answer = user.isAdmin;
        }
    });
    return answer;
};

// just the dashboard part need to be completed
router.post("/dashboard", function(req, res, next) {
  // TODO : change settings and generals of the site
  let flag = isAdmin(
      req.session.userName , req.session.password);
  if(flag){
        res.json({ 
            status: 200, 
            msg: "change settings and site", 
            data: null });
    }else{
        res.json({
            status : 403 ,
            msg : "forbidden. no access" ,
            data : null
        })
    }
});

router.post("/post", function(req, res, next) {
  // TODO saving post
  let flag = isAdmin(
    req.session.userName , req.session.password);
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

router.delete("/post", function(req, res) {
  // TODO delete the post with postid from req.body.postID
  // check the session before
  let flag = isAdmin(
      req.session.userName , req.session.password);
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
        req.session.userName , req.session.password);
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

module.exports = router;
