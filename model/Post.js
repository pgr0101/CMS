let mongoose = require("mongoose");

let PostSchema = mongoose.Schema({
   title : {
       type : String
   } ,

   author : {
       type : mongoose.Types.ObjectId ,
       ref : 'User'
   } ,

   text : {
      type : String
   } ,

   comments : [{
       type : String ,
       author : {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User'
       }

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


module.exports.methodname = function(){
    // TODO somthing with model
};


module.exports.like = function(userName){
    // TODO like increment & adding the username to likers
};

module.exports.comment = function(userName , text){
    // TODO adding comment to the comments as expected (regex)
};

module.exports.savePost = function(postDoc){
    // TODO save the post document
};