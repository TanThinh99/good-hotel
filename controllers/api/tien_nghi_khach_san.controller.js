var tienNghiKSModel = require('./../../models/tien_nghi_khach_san.model');
var taiKhoanModel = require('./../../models/tai_khoan.model');

module.exports.List = async function(req, res) {
    var doc = await tienNghiKSModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var decode = res.locals.decode;
    var account = await taiKhoanModel.findById(decode.id).exec();
    var obj = {
        ma_tien_nghi: req.body.ma_tien_nghi,
        ma_khach_san: account.ma_khach_san
    }
    var doc = await tienNghiKSModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await tienNghiKSModel.findById(id).exec();
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var doc = await tienNghiKSModel.findByIdAndDelete(id);
    res.json(doc);
}