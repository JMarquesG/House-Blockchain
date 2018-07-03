var express = require('express');
var web3config = require('../bin/config');
var _ = require('underscore');
var router = express.Router();

var migrations = require('../build/contracts/Migrations.json');
var creator = require('../build/contracts/InitialCreator.json');
var casa = require('../build/contracts/Casa.json');
var compra = require('../build/contracts/Compra.json');
var herencia = require('../build/contracts/Herencia.json');
var notaria = require('../build/contracts/Notaria.json');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query);
    var hasCookie = Object.prototype.hasOwnProperty.call(req.cookies, 'addressAccount');
    var opt = {
        cookieAddress: hasCookie,
        type: "",
        headers: [],
        values: []
    };

    switch(req.query.type) {
        case "transaccions":
            opt.type = "Transaccions";
            opt.headers = [
                'ID Transacció',
                'ID Contracte',
                'Contracte'
            ];
            opt.name = "transaction";
            var transaccions = [];
            web3config.eth.getBlock('latest').then(res => {
                return Promise.all(_.range(res.number).map(web3config.eth.getBlock));
            }).then(res => {
                console.log(res);
                var promises = [];
                var sum = 0;

                for (var i in res) {
                    for (var j in res[i].transactions) {
                        var transaction = res[i].transactions[j];
                        transaccions.push(transaction);
                        console.log(sum++);
                        console.log(transaction.hash);
                        if (transaction.to != null) {
                            promises.push(web3config.eth.getCode(transaction.to));
                        } else {
                            promises.push(web3config.eth.getTransactionReceipt(transaction.hash));
                        }
                    }
                }
                return Promise.all(promises);
            }).then(res => {
                for (var i in res) {
                    if (res[i].contractAddress)
                        opt.values.push([transaccions[i].hash, res[i].contractAddress, web3config.contractsBytecodes[transaccions[i].input].contractName]);
                    else opt.values.push([transaccions[i].hash, transaccions[i].to, web3config.contractsDeployedBytecodes[res[i]].contractName]);
                }
            }).then(() => {
                opt.values = opt.values.reverse();
                res.render('list', opt);
            });
            break;
        case "propietats":
            var creator_, catastres;
            opt.type = "Propietats";
            opt.headers = [
                'ID Contracte',
                'Cadastre'
            ];
            opt.name = "propietat";
            web3config.creatorContract.then(r => {
                creator_ = r;
                return r.methods.ConsultaCatastres().call();
            }).then(r => {
                catastres = r;
                var promises = r.map(obj => {
                    return creator_.methods.Registre(obj).call();
                })
                return Promise.all(promises);
            }).then(r => {
                for (var i in r) {
                    opt.values.push([r[i], catastres[i]]);
                }
                res.render('list', opt);
            });
            break;
    }
});

module.exports = router;
