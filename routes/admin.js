var express = require('express');
var router = express.Router();
var User = require("../model/User");
var Posr = require("../model/Post");


router.post('/dashboard' , function (req, res, next) {
    // TODO : change settings and generals of the site
    res.json({status : 200 ,
        msg : "change settings and site",
        data : null});
});


router.post('/post' , function (req, res, next) {
    // TODO saving post
    let flag = User.
    canSignIn(req.session.userName ,req.session.password);
    if(flag){
        let post = new Post({
            title : req.body.title ,
            author : req.session.userName ,
            imagesUrl : req.body.imagesUrl
        });
    Post.save(post , function(err , post){
        if(err){
            res.json({status : 406,
                msg : "didn't save post",
                error : err});
        }else{
            User.addPost(req.session.userName , post._id ,
                function(err ){
                    if(err){
                        res.json({
                            status : 406,
                            msg : "didn't save post",
                            error : err});
                    }else {
                        res.json({
                            status : 200 ,
                            msg : "post saved" ,
                            data : post
                        });
                    }
                })
        }
    })
    }
});

router.delete('/post' , function(req , res){
    // TODO delete the post with postid from req.body.postID
    // check the session before
});




module.exports = router;
