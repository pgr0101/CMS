let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

// TOSET the name
mongoose.connect('mongodb://localhost/name???');

var db = mongoose.connection;

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
   ] ,

   posts : [
       {
            type : mongoose.Types.ObjectId
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

var User = module.exports = mongoose.model(
    "User" ,
    UserSchema);

module.exports.register = function(userDoc, cb){
    // TODO adding users to collection
    bcrypt.hash(userDoc.password , 12 , function (err, hash) {
       if(!err){
           userDoc.password = hash;
           userDoc.save(cb);
       }
    });
};


module.exports.getUserByUsername = function(userName){
    // TODO find user By username
    return User.findOne({username : userName});
};

module.exports.canSignIn = function(userName , psswd){
    // TODO return true if user can log in with args
};

module.exports.addToSavedPost = function(postID){
    // TODO save the postid to saved posts
};

module.exports.addPost = function(postID){
    // TODO adding the post id to user posts
};



///////////////////////////////////////////
module.exports.comparePassword = function(candidatePassowrd, hash, callback){
    bcrypt.compare(candidatePassowrd, hash, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    return callback(null, user);
                } else {
                    return callback();
                }
            })
        });
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}
////////////////////////////////////////////