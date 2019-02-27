let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

// TOSET the name
mongoose.connect('mongodb://localhost:27017/CMS');
let db = mongoose.connection.on('open' , function(){
    console.log("done with User");
});


let UserSchema = mongoose.Schema({
   username : {
       type : String ,
       //unique : true ,
       required : true
   } ,

   password : {
       type : String,
       required : true
   } ,

   Email : {
       type : String ,
       required : true
   } ,

   phoneNumber : {
       type : Number ,
       required : true
   } ,

   isAdmin : {
       type : Boolean
   },

   savedPosts : [
       {
           type : mongoose.Schema.Types.ObjectId ,
           ref : 'Post'
       }
   ] ,
   profileImage : {
       type : String
   } ,

   posts : [
       {
            type : mongoose.Schema.Types.ObjectId ,
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

//UserSchema.plugin(uniqueValidator);

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
    let user = await User.findOne({username : userName});
    return user;
};

module.exports.canSignIn = async function(userName , passwd){
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
        (userName ,postID , callback){
    // TODO adding the post id to user posts
    let user = getUserByUsername(userName);
    user.posts.push(postID);
    user.save(callback);

};

module.exports.getPosts = function(username , cb){
    User.findOne({userName : username}).
        populate('posts').exec(cb);
}

