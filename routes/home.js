var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var hasCookie = Object.prototype.hasOwnProperty.call(req.cookies, 'addressAccount');
    res.render('home', { cookieAddress: hasCookie });
});

module.exports = router;
