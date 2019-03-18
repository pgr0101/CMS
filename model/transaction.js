let mongoose = require('mongoose');


let TransactionSchema = mongoose.Schema({

    sender : {
        type : String , 
        required : true 
    } ,

    reciepient : {
        type : String , 
        required : true
    } ,

    amount : {
        type : String , 
        required : true
    } ,

    currency : {
        type : String , 
        required : true
    }

});