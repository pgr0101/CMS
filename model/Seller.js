let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');


let UserSchema = mongoose.Schema({
   username : {
       type : String ,
       unique : true ,
       required : true
   } ,

   password : {
       type : String,
       required : true
   } ,

   phoneNumber : {
       type : String ,
       required : true
   } ,

   profileImage : {
       type : String
   } ,


   productsToBuy : [{
       type : mongoose.Types.ObjectId ,
       ref : 'product'
   }] , 

   productsToSell : [{
        type : mongoose.Types.ObjectId ,
        ref : 'product'
    }] , 

   verified : {
       type : Boolean , 
       default : false
   } ,

   transactions : [{
       type : mongoose.Types.ObjectId, 
       ref : 'transaction'
   }]
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
