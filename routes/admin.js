var express = require('express');
var router = express.Router();

router.get('/dashboard' , function(req , res , next){
    // TODO : res.render("dashboard , data);
});

router.post('/dashboard' , function (req, res, next) {
    // TODO : change settings and generals of the site updating mongoose

    res.json({status : 200 ,
        msg : "change settings and site",
        data : null});
});

router.get('/post' , function (req, res, next) {
    // TODO res.render("post" , data )

});

router.post('/post' , function (req, res, next) {
    // TODO saving post in mongoose

    res.json({status : 200 ,
        msg : "post request",
        data : null});
});



module.exports = router;
