let User = require('../model/User');
let nodemailer = require('nodemailer');

module.exports.sendVerificationCodeEmail = function(username , code) {
    let answer = true;
    let transporter = nodemailer.createTransport({
        service : 'gmail',
        secure: false, // true for 465, false for other ports
        auth: {
          user: "username here", // generated ethereal user
          pass: "password here"  // generated ethereal password
        }
      });
    // TODO send email with nodemailer  
    
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
      };
    
      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions)
      
      // or we can do with callback
      transporter.sendMail(function(err , info){
        if(err){

        }else{

        }
      });

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    

    User.getUserByusername(username , function(err , user){

    });
    
    return answer;
};

module.exports.sendEmail = function(username , msg) {
    // can have different messages and make different function for them and using switch case  
};