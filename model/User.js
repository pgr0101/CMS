let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

// TOSET the name
mongoose.connect('mongodb://localhost/name???');

var db = mongoose.connection;

let UserSchema = mongoose.Schema({
   username : {
       type : String , 
       unique : true
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
           type : mongoose.Types.ObjectId , 
           ref : 'Post'
       }
   ] ,

   posts : [
       {
            type : mongoose.Types.ObjectId , 
            ref : 'Post'
       }
   ]
} ,  {
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

UserSchema.plugin(uniqueValidator);

var User = module.exports = mongoose.model(
    "User" ,
    UserSchema);

module.exports.register = function(userDoc, cb){
    // TODO : adding users to collection
    bcrypt.hash(userDoc.password , 10 , function (err, hash) {
       if(!err){
           userDoc.password = hash;
           // take the error and check that for unique
           userDoc.save(cb);
       }
    });
};


module.exports.getUserByUsername = async function(userName){
    // TODO : find user By username and return it
    return await User.findOne({username : userName});
};

module.exports.canSignIn = function(userName , passwd){
    // TODO return true if user can log in with args return boolean answer
    let user = getUserByUsername(userName);
    return await bcrypt.compare(passwd , user.password);
};

module.exports.addToSaved = function(userName , postID , callback){
    // TODO : save the postid to saved posts
    let user = getUserByUsername(userName);
    user.savedPosts.push(postID);
    user.save(callback);
};

module.exports.addPost = function
        (userName , passwd ,postID , callback){
    // TODO adding the post id to user posts
    // first check the session then do something here
    // in session or cookie we saved the username and passwd
    let canPost = canSignIn(userName , passwd);
    if(canPost){
        let user = getUserByUsername(userName);
        user.posts.push(postID);
        user.save(callback);
    }
};

