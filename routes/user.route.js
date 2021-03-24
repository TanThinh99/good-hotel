var express = require('express');
var router = express.Router();

var mid = require('./../middlewares/middleware');
var userCtrl = require('./../controllers/user.controller');

router.get('', userCtrl.Index);
router.get('/account', mid.GoToAccountUser, userCtrl.Account);
router.get('/detail/:hotelID', userCtrl.HotelDetail);
router.get('/basket', userCtrl.Basket);
router.get('/logout', userCtrl.Logout);

// AJAX
router.get('/district_of_city/:cityID', userCtrl.District_of_city);
router.get('/wards_of_district/:distID', userCtrl.Wards_of_district);

module.exports = router;