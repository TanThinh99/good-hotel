var tienNghiKSModel = require('./../../models/tien_nghi_khach_san.model');

module.exports.List = async function(req, res) {
    var doc = await tienNghiKSModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        ma_tien_nghi: req.body.ma_tien_nghi,
        ma_khach_san: req.body.ma_khach_san
    }
    var doc = await tienNghiKSModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await tienNghiKSModel.findById(id).exec();
    res.json(doc);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var obj = {
        ma_tien_nghi: req.body.ma_tien_nghi,
        ma_khach_san: req.body.ma_khach_san
    }
    var doc = await tienNghiKSModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var doc = await tienNghiKSModel.findByIdAndDelete(id);
    res.json(doc);
}