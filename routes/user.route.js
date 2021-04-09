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
    // Choose address
router.get('/district_of_city/:cityID', userCtrl.District_of_city);
router.get('/wards_of_district/:distID', userCtrl.Wards_of_district);

    // Basket
router.post('/addToBasket', userCtrl.AddToBasket);
router.put('/updateInBasket', userCtrl.UpdateInBasket);
router.delete('/deleteInBasket', userCtrl.DeleteInBasket);

    // Bill
router.get('/getBillDetail/:billID', userCtrl.GetBillDetail);
router.put('/payBill', mid.GoToAccountUser, userCtrl.PayBill);
router.delete('/destroyBill', mid.GoToAccountUser, userCtrl.DestroyBill);

    // Pagination
router.get('/getHotelForPagination', userCtrl.GetHotelForPagination);
router.get('/getCommentHotelForPagination', userCtrl.GetCommentHotelForPagination);

module.exports = router;