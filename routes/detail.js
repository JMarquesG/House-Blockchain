var express = require('express');
var web3config = require('../bin/config');
var router = express.Router();

var casa = require('../build/contracts/Casa.json');

router.post('/', function(req, res) {
    var hasCookie = Object.prototype.hasOwnProperty.call(req.cookies, 'addressAccount');
    var opt = {
        cookieAddress: hasCookie,
        type: "",
        headers: [
            'ID Contracte',
            'ID Propietari',
            'Propietari',
            'Catastre',
            'Compra Pendent',
            'Herencia Pendent'
        ],
        value: ["", "", "", "", "", ""]
    };
    var detail = new web3config.contract(casa.abi, req.body.id_casa);
    switch(req.query.validate) {
        case "compra":
            detail.methods.canviarPropietaricompra().send({from: req.cookies.addressAccount, gas: 4712388, gasPrice: 100000000000 }).then(res => {
                console.log('canviarPropietaricompra Response');
                console.log(res);
            }).catch(error => {
                console.log('canviarPropietaricompra Error');
                console.log(error);
            }).then(() => {
                res.redirect('/list?type=propietats');
            });
            break;
        case "herencia":
            detail.methods.canviarPropietariherencia().send({from: req.cookies.addressAccount, gas: 4712388, gasPrice: 100000000000 }).then(res => {
                console.log('canviarPropietariherencia Response');
                console.log(res);
            }).catch(error => {
                console.log('canviarPropietariherencia Error');
                console.log(error);
            }).then(() => {
                res.redirect('/list?type=propietats');
            });
            break;
    }
});

router.get('/', function(req, res) {
    console.log(req.query)
    var hasCookie = Object.prototype.hasOwnProperty.call(req.cookies, 'addressAccount');
    var opt = {
        cookieAddress: hasCookie,
        type: "Casa",
        catastre: "",
        headers: [
            'ID Contracte',
            'ID Propietari',
            'Propietari',
            'Catastre',
            'Compra Pendent',
            'Herencia Pendent'
        ],
        value: ["", "", "", "", "", ""]
    };
    switch (req.query.type) {
        case "propietat":
            opt.type = "Casa";
            opt.headers = [
                'ID Contracte',
                'ID Propietari',
                'Propietari',
                'Catastre',
                'Compra Pendent',
                'Herencia Pendent'
            ];
            opt.value = new Array(6);
            opt.value[0] = req.query.address;
            var detail = new web3config.contract(casa.abi, req.query.address);
            detail.methods.getAddressPropietari().call().then(r => {
                opt.value[1] = r;
                return detail.methods.getPropietari().call();
            }).then(r => {
                opt.value[2] = r;
                return detail.methods.getCatastre().call();
            }).then(r => {
                opt.value[3] = r;
                opt.catastre = r;
                return detail.methods.getCompraPendent().call();
            }).then(r => {
                opt.value[4] = r;
                return detail.methods.getHerenciaPendent().call();
            }).then(r => {
                opt.value[5] = r;
                res.render('detail', opt);
            });
            break;
        case "transaction":
            opt.type = "Transacció";
            opt.headers = [
                'ID Transacció',
                'ID Contracte',
                'Contracte',
                'Data'
            ];
            opt.value = new Array(4);
            opt.value[0] = req.query.address;
            web3config.eth.getTransaction(req.query.address).then(r => {
                if (r.to != null) {
                    opt.value[1] = r.to;
                    opt.value[3] = JSON.stringify(web3config.decodeInput(r.input), null, 4);
                    console.log(opt.value[3]);
                    return web3config.eth.getCode(r.to);
                } else {
                    opt.value[2] = web3config.contractsBytecodes[r.input].contractName;
                    return web3config.eth.getTransactionReceipt(r.hash);
                }
            }).then(r => {
                if (r.contractAddress) opt.value[1] = r.contractAddress;
                else opt.value[2] = web3config.contractsDeployedBytecodes[r].contractName;
            }).then(() => {
                res.render('detail', opt);
            });
            break;
    }
});

module.exports = router;
