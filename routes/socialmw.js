let router = require('express').Router();


router.use(function(req , res , next){
    if(req.session.username && req.session.password){
        User.getUserByusername(req.session.username , function(err , user){
            if(!err){
                let flag = User.comparePass(req.session.password , user.password);
                if(flag){
                    next();
                }else{
                    res.json({
                        status : 401,
                        msg : "not autoriized" ,
                        data : null
                    })
                }
            }else{
                console.log(err);
                res.json({
                status : 406 ,
                msg : "problem with authentication try later"
                });
            }
        });    
    } else{
        res.json({
            status : 401 ,
            msg : "not authorized"
        });
    }
});


module.exports = router;