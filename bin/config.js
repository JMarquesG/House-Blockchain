var _ = require('underscore');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const inputDecoder = require('abi-decoder');

var migrations = require('../build/contracts/Migrations.json');
var creator = require('../build/contracts/InitialCreator.json');
var casa = require('../build/contracts/Casa.json');
var compra = require('../build/contracts/Compra.json');
var herencia = require('../build/contracts/Herencia.json');
var notaria = require('../build/contracts/Notaria.json');

var contracts = {};
var deployedContracts = {};

contracts[migrations.bytecode] = migrations;
contracts[creator.bytecode] = creator;
contracts[casa.bytecode] = casa;
contracts[compra.bytecode] = compra;
contracts[herencia.bytecode] = herencia;
contracts[notaria.bytecode] = notaria;

deployedContracts[migrations.deployedBytecode] = migrations;
deployedContracts[creator.deployedBytecode] = creator;
deployedContracts[casa.deployedBytecode] = casa;
deployedContracts[compra.deployedBytecode] = compra;
deployedContracts[herencia.deployedBytecode] = herencia;
deployedContracts[notaria.deployedBytecode] = notaria;

exports.contractsBytecodes = contracts;
exports.contractsDeployedBytecodes = deployedContracts;

function inputDecode (abi, input) {
    inputDecoder.addABI(abi);
    var inputDecoded = inputDecoder.decodeMethod(input);
    inputDecoder.removeABI(abi);
    return inputDecoded;
}

exports.inputDecode = inputDecode;

exports.decodeInput = (input) => {
    var inputDecoded = [
        inputDecode(casa.abi, input),
        inputDecode(compra.abi, input),
        inputDecode(herencia.abi, input),
        inputDecode(notaria.abi, input),
        inputDecode(creator.abi, input),
        inputDecode(migrations.abi, input)
    ];
    return inputDecoded.filter(obj => { return obj; })[0];
}

exports.eth = web3.eth;
exports.utils = web3.utils;
exports.accounts = web3.eth.getAccounts();
exports.contract = web3.eth.Contract;
exports.getCode = web3.eth.getCode;
exports.getTransactionReceipt = web3.eth.getTransactionReceipt;

exports.allBlocks = web3.eth.getBlock('latest').then(res => {
    return Promise.all(_.range(res.number).map(web3.eth.getBlock));
});

exports.creatorContract = exports.allBlocks.then(res => {
    var promises = res.filter(elem => {
        return elem.transactions.length && elem.transactions[0].input == creator.bytecode;
    }).map(elem => {
        return web3.eth.getTransactionReceipt(elem.transactions[0].hash);
    });
    return Promise.all(promises);
}).then(res => {
    creatorAddress = res[0].contractAddress;
    return new web3.eth.Contract(creator.abi, res[0].contractAddress);
});
