let User = require('../model/User');


module.exports.sendVerificationCode = function(username , code) {
    let answer = true;
    // TODO send sms with api  
    // site : https://www.sms.ir/

    User.getUserByusername(username , function(err , user){

    });
    
    return answer;
};

// here we can make some sms fucntions with switch case to send different sms
