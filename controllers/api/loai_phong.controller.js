var loaiPhongModel = require('./../../models/loai_phong.model');

module.exports.List = async function(req, res) {
    var doc = await loaiPhongModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        ten: req.body.ten,
        gia: req.body.gia,
        so_luong: req.body.so_luong,
        so_luong_con_lai: req.body.so_luong_con_lai,
        hinh_anh_360: req.body.hinh_anh_360,
        ma_khach_san: req.body.ma_khach_san
    }
    obj.disabled = false;
    var doc = await loaiPhongModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await loaiPhongModel.findById(id).exec();
    res.json(doc);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var obj = {
        ten: req.body.ten,
        gia: req.body.gia,
        so_luong: req.body.so_luong,
        so_luong_con_lai: req.body.so_luong_con_lai,
        hinh_anh_360: req.body.hinh_anh_360,
        disabled: req.body.disabled
    }
    var doc = await loaiPhongModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var doc = await loaiPhongModel.findByIdAndDelete(id);
    res.json(doc);
}