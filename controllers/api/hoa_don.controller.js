var jwt = require('jsonwebtoken');

var hoaDonModel = require('./../../models/hoa_don.model');

module.exports.List = async function(req, res) {
    var doc = await hoaDonModel.find();
    res.json(doc);
}

module.exports.Add = function(req, res) {
    var authorization = req.headers.authorization;
    var tokenArr = authorization.split(' ');

    var d = new Date();
    var time = d.getFullYear() +"-"+ (d.getMonth()*1+1) +"-"+d.getDate() +" "+d.getHours() +":"+d.getMinutes() +":"+d.getSeconds();
    jwt.verify(tokenArr[1], process.env.SECRET_JWT, function(err, decode) {
        var obj = {
            ngay_dat_phong: time,
            ngay_tra_phong: '',
            ngay_het_han: req.body.ngay_het_han,
            tien_thanh_toan_truoc: req.body.tien_thanh_toan_truoc,
            gia_dat_phong: req.body.gia_dat_phong,
            ma_tai_khoan: decode.id,
            ma_loai_phong: req.body.ma_loai_phong
        }
        hoaDonModel.insertMany([obj], function(err, doc) {
            if (err) throw err;
            res.json(doc);
        });        
    });    
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await hoaDonModel.findById(id).exec();
    res.json(doc);
}

module.exports.ConfirmReturnedRoom = async function(req, res) {
    var id = req.params.id;
    var d = new Date();
    var time = d.getFullYear() +"-"+ (d.getMonth()*1+1) +"-"+d.getDate() +" "+d.getHours() +":"+d.getMinutes() +":"+d.getSeconds();
    var obj = {
        ngay_tra_phong: time
    }
    var doc = await hoaDonModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}