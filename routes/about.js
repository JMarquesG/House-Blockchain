var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var hasCookie = Object.prototype.hasOwnProperty.call(req.cookies, 'addressAccount');
    var opt = {
        cookieAddress: hasCookie,
        names: [
            "Albert Carvajal",
            "Jordi Marqués",
            "Irina Vasilieva",
            "Aleix Boixader"
        ]
    }
    res.render('about', opt);
});

module.exports = router;
