var quyenModel = require('./../../models/quyen.model');
var vaiTroCoQuyenModel = require('./../../models/vai_tro_co_quyen.model');

module.exports.List = async function(req, res) {
    var doc = await quyenModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        ten: req.body.ten
    }
    var doc = await quyenModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await quyenModel.findById(id).exec();
    res.json(doc);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var obj = {
        ten: req.body.ten
    }
    var doc = await quyenModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var docs = await vaiTroCoQuyenModel.deleteMany({ ma_quyen: id });
    
    var doc = await quyenModel.findByIdAndDelete(id);
    res.json(doc);
}