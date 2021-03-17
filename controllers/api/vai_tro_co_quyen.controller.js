var vaiTroCoQuyenModel = require('./../../models/vai_tro_co_quyen.model');

module.exports.List = async function(req, res) {
    var doc = await vaiTroCoQuyenModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        ma_vai_tro: req.body.ma_vai_tro,
        ma_quyen: req.body.ma_quyen
    }
    var doc = await vaiTroCoQuyenModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await vaiTroCoQuyenModel.findById(id).exec();
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var doc = await vaiTroCoQuyenModel.findByIdAndDelete(id);
    res.json(doc);
}