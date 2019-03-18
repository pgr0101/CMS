let mongoose = require('mongoose');

let productSchema = mongoose.Schema({

    name : {
        type : String ,
        required : true
    } ,

    description : {
        type : String , 
    } ,

    price : {
        type : Number
    } ,
    currency : {
        type : String ,
        requires : true
    } ,

    imagesUrl = [{
        type : String ,
        required : true
    }] ,

    sendVia : {
        type : String , 
        default : 'usual post'
    } ,

    barCode : {
        type : String ,
        required : true
    } , 

    cost : {
        type : Number
    } ,

    numberInStore : {
        type : Number , 
        default : 0
    } , 

    comment : {
        type : String
    } ,

    rate : {
        type : Number
    }

},  {
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


let product = module.exports = mogoose.model('product' , productSchema);

module.exports.method = function(input){
    // TODO do stuff 

};