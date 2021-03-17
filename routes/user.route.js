var express = require('express');
var router = express.Router();

var userCtrl = require('./../controllers/user.controller');

router.get('', userCtrl.Index);
router.get('/account', userCtrl.Account);
router.get('/hotel-detail', userCtrl.HotelDetail);
router.get('/checkout', userCtrl.Checkout);

module.exports = router;