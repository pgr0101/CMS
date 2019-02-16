let mongoose = require("mongoose");

let PostSchema = mongoose.Schema({
   title : {
       type : String
   } ,

   author : {
       type : mongoose.Types.ObjectId
   } ,

   text : {
      type : String
   } ,

   comments : [{
       type : mongoose.Types.ObjectId
   }] ,

   imagesUrl : [{
       url : {
           type : String
       }
   }]

});

var Post = module.exprts = mongoose.model('Post' , PostSchema);


module.exports.methodname = function(){
    // TODO somthing with model
}