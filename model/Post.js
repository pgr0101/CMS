let mongoose = require("mongoose");

let PostSchema = mongoose.Schema({
   title : {
       type : String
   } ,

   author : {
       type : String
   } ,

   text : {
      type : String
   } ,

   comments : [{
        type : String // regexp username@text
   }] ,

   imagesUrl : [{
       url : {
           type : String
       }
   }] ,

   like : {
       type : Number
   } ,

   likers : [
       {
           type : mongoose.Types.ObjectId
       }
   ]
} , {
    toObject: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    }
});

var Post = module.exprts = mongoose.model('Post' , PostSchema);


module.exports.like = function(userName , postID , cb){
    // TODO like increment & adding the username to likers
    // checking the session and can sign in before
    getPostByPostID(postID , function(err , post , cb){
        post.like = post.like + 1;
        post.likers.push(userName);
        post.save(cb); // err
    });
};

module.exports.comment = function(postID , userName , text , cb){
    // TODO adding comment to the comments as expected (regex)
    // checking session or cookie and can signin
    getPostByPostID(postID , function(post , cb){
        post.comments.push(userName + "@" + text);
        post.save(cb); // err
    });
};

module.exports.getPostByPostID = function(postID , callback){
    Post.findById(postID , callback)
}

module.exports.savePost = function(postDoc , callback){
    // TODO save the post document
    // session or cookie check with canSignIn
    postDoc.save(callback); // cb
};