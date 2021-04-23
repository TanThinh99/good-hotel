var express = require('express');
var router = express.Router();

var mid = require('./../middlewares/middleware');
var userCtrl = require('./../controllers/user.controller');

router.get('', userCtrl.Index);
router.get('/account', mid.GoToAccountUser, userCtrl.Account);
router.get('/logout', userCtrl.Logout);
router.post('/forgetPassword', userCtrl.ForgetPassword);
router.post('/confirmNewPassword', userCtrl.ConfirmNewPassword);

router.get('/detail/:hotelID', userCtrl.HotelDetail);
router.get('/basket', userCtrl.Basket);
router.get('/checkout', userCtrl.Checkout);
router.post('/onlinePayment', userCtrl.OnlinePayment);
router.get('/successPayment', userCtrl.SuccessPayment);

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
router.get('/payBill', mid.GoToAccountUser, userCtrl.PayBill);
router.get('/successPaymentOfBill', mid.GoToAccountUser, userCtrl.SuccessPaymentOfBill);
router.delete('/destroyBill', mid.GoToAccountUser, userCtrl.DestroyBill);

    // Pagination
router.get('/getHotelForPagination', userCtrl.GetHotelForPagination);
router.get('/getCommentHotelForPagination', userCtrl.GetCommentHotelForPagination);
router.get('/getBillForPagination', userCtrl.GetBillForPagination);

module.exports = router;