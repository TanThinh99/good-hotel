var khachSanModel = require('./../../models/khach_san.model');

module.exports.List = async function(req, res) {
    var doc = await khachSanModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        ten: req.body.ten,
        dia_chi: req.body.dia_chi,
        so_dien_thoai: req.body.so_dien_thoai,
        google_map: req.body.google_map,
        gia: req.body.gia,
        diem_trung_binh: req.body.diem_trung_binh,
        so_luong_binh_luan: req.body.so_luong_binh_luan,
        so_phong_con_lai: req.body.so_phong_con_lai,
        maxp: req.body.maxp
    }
    var doc = await khachSanModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await khachSanModel.findById(id).exec();
    res.json(doc);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var obj = {
        ten: req.body.ten,
        dia_chi: req.body.dia_chi,
        so_dien_thoai: req.body.so_dien_thoai,
        google_map: req.body.google_map,
        gia: req.body.gia,
        diem_trung_binh: req.body.diem_trung_binh,
        so_luong_binh_luan: req.body.so_luong_binh_luan,
        so_phong_con_lai: req.body.so_phong_con_lai,
        maxp: req.body.maxp
    }
    var doc = await khachSanModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var doc = await khachSanModel.findByIdAndDelete(id);
    res.json(doc);
}