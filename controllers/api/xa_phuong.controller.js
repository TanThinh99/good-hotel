var ids = require('short-id');

var xaPhuongModel = require('./../../models/xa_phuong.model');

module.exports.List = async function(req, res) {
    var doc = await xaPhuongModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        _id: ids.generate(),
        ten: req.body.ten,
        loai: req.body.loai,
        maqh: req.body.maqh
    }
    var doc = await xaPhuongModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await xaPhuongModel.findOne({_id: id});
    res.json(doc);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var obj = {
        ten: req.body.ten,
        loai: req.body.loai,
        maqh: req.body.maqh
    }
    var doc = await xaPhuongModel.updateOne({_id: id}, obj);
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var doc = await xaPhuongModel.deleteOne({_id: id});
    res.json(doc);
}