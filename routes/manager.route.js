var express = require('express');
var router = express.Router();

var mid = require('./../middlewares/middleware');
var managerCtrl = require('./../controllers/manager.controller');

router.get('', mid.GoToManagerPage, managerCtrl.Hotel);
router.get('/convenient', mid.GoToManagerPage, managerCtrl.Convenient);

router.get('/roomType', mid.GoToManagerPage, managerCtrl.RoomType);
router.get('/roomType/:roomTypeID', mid.GoToManagerPage, managerCtrl.UpdateRoomType);
router.get('/addRoomType', mid.GoToManagerPage, managerCtrl.AddRoomType);

router.get('/checkRoom', mid.GoToManagerPage, managerCtrl.CheckRoom);
router.delete('/destroyBill', mid.GoToManagerPage, managerCtrl.DestroyBill);
router.put('/paidBill', mid.GoToManagerPage, managerCtrl.PaidBill);
router.put('/returnRoom', mid.GoToManagerPage, managerCtrl.ReturnRoom);

router.get('/comment', mid.GoToManagerPage, managerCtrl.Comment);
router.get('/replyComment/:commentID', mid.GoToManagerPage, managerCtrl.ReplyComment);

router.get('/bill', mid.GoToManagerPage, managerCtrl.Bill);
router.get('/bill/:billID', mid.GoToManagerPage, managerCtrl.BillDetail);

// =================== A J A X ================
router.get('/getCommentForPagination', managerCtrl.GetCommentForPagination);
router.get('/getBillForPagination', managerCtrl.GetBillForPagination);

module.exports = router;