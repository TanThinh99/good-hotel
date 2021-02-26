var express = require('express');
var router = express.Router();

var apiCtrl = require('./../controllers/api.controller');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, Date.now() +'-'+ file.originalname);
    }
});
var uploads = multer({ storage: storage });

router.get('/tinh_thanh_pho', apiCtrl.get);
router.post('/add', uploads.single('hinhanh'), apiCtrl.callAPI);

module.exports = router;