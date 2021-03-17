var vaiTroModel = require('./../../models/vai_tro.model');
var taiKhoanModel = require('./../../models/tai_khoan.model');
var vaiTroCoQuyenModel = require('./../../models/vai_tro_co_quyen.model');
const vaiTroCoQuyen = require('./../../models/vai_tro_co_quyen.model');

module.exports.List = async function(req, res) {
    var doc = await vaiTroModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        ten: req.body.ten        
    }
    obj.disabled = false;
    var doc = await vaiTroModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await vaiTroModel.findById(id).exec();
    res.json(doc);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var obj = {
        ten: req.body.ten,
        disabled: req.body.disabled
    }
    var doc = await vaiTroModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var docs = await taiKhoanModel.find({ ma_vai_tro: id });
    if (docs.length == 0) {
        // Không có tài khoản nào có vai trò này
        var docs = await vaiTroCoQuyenModel.deleteMany({ ma_vai_tro: id });
        
        var doc = await vaiTroModel.findByIdAndDelete(id);
        res.json(doc);
    } 
    else {
        // Có tài khoản thuộc vai trò này
        var doc = await vaiTroModel.findById(id).exec();
        doc.disabled = true;
        doc.save();
        res.json(doc);
    }
}

module.exports.HavePermission = async function(req, res) {
    var id = req.params.id;
    var docs = await vaiTroCoQuyen.find({ ma_vai_tro: id }).populate('ma_quyen');
    res.json(docs);
}