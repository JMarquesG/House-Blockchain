var express = require('express');
var web3config = require('../bin/config');
var router = express.Router();

var casa = require('../build/contracts/Casa.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    var hasCookie = Object.prototype.hasOwnProperty.call(req.cookies, 'addressAccount');
    var opt = {
        cookieAddress: hasCookie,
        type: req.query.type
    };
    switch(req.query.type) {
        case "propietat":
            opt.headers = [
                "ID Propietari",
                "Propietari",
                "Cadastre"
            ];
            opt.properties = [
                "id_propietari",
                "propietari",
                "cadastre"
            ];
            break;
        case "compra":
            opt.headers = [
                "Cadastre",
                "ID Comprador",
                "Comprador"
            ];
            opt.properties = [
                "cadastre",
                "id_comprador",
                "comprador"
            ];
            break;
        case "herencia":
            opt.headers = [
                "Cadastre",
                "ID Hereu",
                "Hereu"
            ];
            opt.properties = [
                "cadastre",
                "id_hereu",
                "hereu"
            ];
            break;
    }
    res.render('add', opt);
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    var creatorContract;
    switch(req.body.type) {
        case "propietat":
            web3config.creatorContract.then(contract => {
                return contract.methods.createnewCasa(req.body.id_propietari, req.body.propietari, req.body.cadastre).send({from: req.cookies.addressAccount, gas: 4712388, gasPrice: 100000000000 });
            }).then(res => {
                console.log('createnewCasa Response');
                console.log(res);
            }).catch(error => {
                console.log('createnewCasa Error');
                console.log(error);
            }).then(() => {
                res.redirect('/list?type=propietats');
            });
            break;
        case "compra":
            web3config.creatorContract.then(contract => {
                return contract.methods.Registre(req.body.cadastre).call()
            }).then(res => {
                return new web3config.contract(casa.abi, res);
            }).then(contract => {
                contract.methods.createCompra(req.body.id_comprador, req.body.comprador).send({from: req.cookies.addressAccount, gas: 4712388, gasPrice: 100000000000 });
            }).then(res => {
                console.log('createCompra Response');
                console.log(res);
            }).catch(error => {
                console.log('createCompra Error');
                console.log(error);
            }).then(() => {
                res.redirect('/list?type=propietats');
            });
            break;
        case "herencia":
            web3config.creatorContract.then(contract => {
                return contract.methods.Registre(req.body.cadastre).call()
            }).then(res => {
                return new web3config.contract(casa.abi, res);
            }).then(contract => {
                contract.methods.createHerencia(req.body.id_hereu, req.body.hereu).send({from: req.cookies.addressAccount, gas: 4712388, gasPrice: 100000000000 });
            }).then(res => {
                console.log('createHerencia Response');
                console.log(res);
            }).catch(error => {
                console.log('createHerencia Error');
                console.log(error);
            }).then(() => {
                res.redirect('/list?type=propietats');
            });
            break;
        default: res.redirect('/list?type=transaccions');
    }
});

module.exports = router;
