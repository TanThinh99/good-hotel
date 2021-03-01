var express = require('express');
var router = express.Router();

var userApiCtrl = require('./../controllers/api/userApi.controller');
var tinhThanhCtrl = require('./../controllers/api/tinh_thanh.controller');
var quanHuyenCtrl = require('./../controllers/api/quan_huyen.controller');
var taiKhoanCtrl = require('./../controllers/api/tai_khoan.controller');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, Date.now() +'-'+ file.originalname);
    }
});
var uploads = multer({ storage: storage });

// USER
router.post('/postLogin', userApiCtrl.PostLogin);
router.get('/logout', userApiCtrl.Logout);

// Tinh_thanh
router.get('/tinh_thanh', tinhThanhCtrl.List);
router.post('/tinh_thanh', uploads.any(), tinhThanhCtrl.Add);
// single('hinhAnhHH')
// Quan huyen
router.get('/quan_huyen', quanHuyenCtrl.list);

// Xa_phuong


// Tai_khoan
router.get('/tai_khoan', taiKhoanCtrl.List);
router.post('/tai_khoan', uploads.single('avatar'), taiKhoanCtrl.Add);

var mid = require('./../middlewares/middleware');
router.get('/callAPI', mid.IsAdmin, function(req, res) {
    res.render('test', {});
});

module.exports = router;