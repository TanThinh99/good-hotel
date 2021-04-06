var jwt = require('jsonwebtoken');
var binhLuanModel = require('./../../models/binh_luan.model');

module.exports.List = async function(req, res) {
    var doc = await binhLuanModel.find();
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await binhLuanModel.findById(id).exec();
    res.json(doc);
}

function FormatNumberInDate(number) {
    if(number < 10) {
        return '0'+ number;
    }
    return number;
}

function GetTimeNow() {
    var d = new Date();
    var month = FormatNumberInDate(d.getMonth() + 1);
    var date = FormatNumberInDate(d.getDate());
    var hour = FormatNumberInDate(d.getHours());
    var minute = FormatNumberInDate(d.getMinutes());
    var second = FormatNumberInDate(d.getSeconds());
    return d.getFullYear() +"-"+ month +"-"+ date +" "+ hour +":"+ minute +":"+second;
}

module.exports.MemberAdd = function(req, res) {
    var authorization = req.headers.authorization;
    var tokenArr = authorization.split(' ');
    
    jwt.verify(tokenArr[1], process.env.SECRET_JWT, function(err, decode) {
        var obj = {
            noi_dung_tot: req.body.noi_dung_tot,
            noi_dung_xau: req.body.noi_dung_xau,
            diem: req.body.diem,
            thoi_gian: GetTimeNow(),
            noi_dung_phan_hoi: '',
            thoi_gian_phan_hoi: '',
            da_xem: false,
            ma_tai_khoan: decode.id,
            ma_khach_san: req.body.ma_khach_san
        }
        binhLuanModel.insertMany([obj], function(err, doc) {
            if (err) throw err;
            res.json(doc);
        });
    }); 
}

module.exports.MemberUpdate = async function(req, res) {
    var id = req.params.id;
    var obj = {
        noi_dung_tot: req.body.noi_dung_tot,
        noi_dung_xau: req.body.noi_dung_xau,
        diem: req.body.diem,
        thoi_gian: GetTimeNow()
    }
    var doc = await binhLuanModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.MemberDelete = async function(req, res) {
    var id = req.params.id;
    var doc = await binhLuanModel.findByIdAndDelete(id);
    res.json(doc);
}

module.exports.ManagerUpdate = async function(req, res) {
    var id = req.params.id;
    var obj = {
        noi_dung_phan_hoi: req.body.noi_dung_phan_hoi,
        thoi_gian_phan_hoi: GetTimeNow(),
        da_xem: true
    }
    if(req.body.noi_dung_phan_hoi == '') {
        obj.da_xem = false;
    }
    var doc = await binhLuanModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.ManagerDelete = async function(req, res) {
    var id = req.params.id;
    var obj = {
        noi_dung_phan_hoi: '',
        thoi_gian_phan_hoi: '',
        da_xem: false
    }
    var doc = await binhLuanModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.ConfirmSeen = async function(req, res) {
    var id = req.params.id;
    var obj = {
        da_xem: true
    }
    var doc = await binhLuanModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}