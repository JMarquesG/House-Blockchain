var web3Interface = require('../bin/config.js');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/', (req, res, next) => {
    web3Interface.accounts.then(result => {
        res.cookie('addressAccount', result[0]);
        res.redirect('/');
    });
});

module.exports = router;
