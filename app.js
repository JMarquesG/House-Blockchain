var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var _ = require('underscore');

var indexRouter = require('./routes/home');
var addRouter = require('./routes/add');
var aboutRouter = require('./routes/about');
var listRouter = require('./routes/list');
var loginRouter = require('./routes/login');
var detailRouter = require('./routes/detail');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var web3config = require('./bin/config.js');

app.use((req, res, next) => {
    web3config.creatorContract.then((contract => {
        req.creatorContract = contract;
        next();
    }))
});

app.use('/', indexRouter);
app.use('/add', addRouter);
app.use('/login', loginRouter);
app.use('/list', listRouter);
app.use('/about', aboutRouter);
app.use('/detail', detailRouter);

/*
var account;
var creatorContract;
web3config.accounts.then(accounts => {
    account = accounts[0];
    return web3config.creatorContract;
}).then(contract => {
    creatorContract = contract;
    console.log(account);
    return creatorContract.methods.createnewCasa(account, "albert", 1234).send({from: account, gas: 4712388, gasPrice: 100000000000 })
}).then(response => {
    return creatorContract.methods.Registre(1234).call();
}).then(response => {
    return new web3config.contract(require('./build/contracts/Casa.json').abi, response);
}).then((response => {
    console.log('createnewCasa Response');
    console.log(response);
})).catch(error => {
    console.log('createnewCasa Error');
    console.log(error);
});
*/
/*
const inputDecoder = require('abi-decoder');
var creator = require('./build/contracts/InitialCreator.json');
var casa = require('./build/contracts/Casa.json');


web3config.eth.getTransaction('0xdb8d0ed485c9658a96b8c791732bb64469437cc6a54b408381e3c91ebdc0068b').then(res => {
    var inputDecoded;

    inputDecoder.addABI(creator.abi);
    inputDecoded = inputDecoder.decodeMethod(res.input);
    if (inputDecoded) {
        console.log(res.to);
        console.log(inputDecoded);
    }
    inputDecoder.removeABI(creator.abi);

    inputDecoder.addABI(casa.abi);
    inputDecoded = inputDecoder.decodeMethod(res.input);
    if (inputDecoded) {
        console.log(res.to);
        console.log(inputDecoded);
    }
    inputDecoder.removeABI(creator.abi);
})
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
