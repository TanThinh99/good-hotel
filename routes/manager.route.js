var express = require('express');
var router = express.Router();

var mid = require('./../middlewares/middleware');
var managerCtrl = require('./../controllers/manager.controller');

router.get('/:hotelID', mid.GoToManagerPage, managerCtrl.Hotel);
router.get('/:hotelID/convenient', mid.GoToManagerPage, managerCtrl.Convenient);

router.get('/:hotelID/roomType', mid.GoToManagerPage, managerCtrl.RoomType);
router.get('/:hotelID/roomType/:roomTypeID', mid.GoToManagerPage, managerCtrl.UpdateRoomType);
router.get('/:hotelID/addRoomType', mid.GoToManagerPage, managerCtrl.AddRoomType);

router.get('/:hotelID/checkRoom', mid.GoToManagerPage, managerCtrl.CheckRoom);

router.get('/:hotelID/comment', mid.GoToManagerPage, managerCtrl.Comment);
router.get('/:hotelID/replyComment/:commentID', mid.GoToManagerPage, managerCtrl.ReplyComment);

router.get('/:hotelID/bill', mid.GoToManagerPage, managerCtrl.Bill);
router.get('/:hotelID/bill/:billID', mid.GoToManagerPage, managerCtrl.BillDetail);

module.exports = router;