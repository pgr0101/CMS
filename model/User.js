let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
   username : {
       type : String
   } ,

   password : {
       type : String
   } ,

   Email : {
       type : String
   } ,

   phoneNumber : {
       type : String
   } ,

   savedPosts : [
       {
           type : mongoose.Types.ObjectId
       }
   ]
});

var User = module.exports = mongoose.model(
    "User" ,
    UserSchema);

module.exports.methodname = function () {
    // TODO something with model
}