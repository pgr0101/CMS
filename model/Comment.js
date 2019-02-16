let mongoose = require('mongoose');

let CommentSchema = mongoose.Schema({
    author : {
        type : mongoose.Types.ObjectId
    } ,
    text : {
        type: String
    }
});

var Comment = module.exports = mongoose.model(
    "Comment" ,
    CommentSchema);

module.exports.methodname = function(){
    // TODO something with model
}