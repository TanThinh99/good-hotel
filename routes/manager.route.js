var express = require('express');
var router = express.Router();

var managerCtrl = require('./../controllers/manager.controller');

router.get('', managerCtrl.Hotel);
router.get('/convenient', managerCtrl.Convenient);
router.get('/roomType', managerCtrl.RoomType);
router.get('/checkRoom', managerCtrl.CheckRoom);
router.get('/comment', managerCtrl.Comment);
router.get('/bill', managerCtrl.Bill);
router.get('/billDetail', managerCtrl.BillDetail);
router.get('/replyComment', managerCtrl.ReplyComment);
router.get('/updateRoomType', managerCtrl.UpdateRoomType);

module.exports = router;