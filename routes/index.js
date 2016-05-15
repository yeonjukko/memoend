var express = require('express');
var router = express.Router();
var signup = require('./signup');
var login = require('./login');
var main = require('./main');
var memo = require('./memo');
var mTitleLoader = require('./mTitleLoader');
var mDataLoader = require('./mDataLoader');
var mAllNameLoader = require('./mAllNameLoader');
var mModiMemo = require('./mModiMemo');
var mNewMemo = require('./mNewMemo');
var mNewTitle = require('./mNewTitle');


/* GET home page. */
//router.get('/', function (req, res, next) {
//    res.render('index', {title: 'Express'});
//});

router.get('/signup', signup.signup);
router.get('/login', login.login);
router.get('/main', main.main);
router.get('/memo', memo.memo);
router.get('/mTitleLoader', mTitleLoader.mTitleLoader);
router.get('/mDataLoader', mDataLoader.mDataLoader);
router.get('/mAllNameLoader', mAllNameLoader.mAllNameLoader);
router.post('/mModiMemo', mModiMemo.mModiMemo);
router.post('/mNewMemo',mNewMemo.mNewMemo);
router.get('/mNewTitle',mNewTitle.mNewTitle);



module.exports = router;
