var ids = require('short-id');

var tinhThanhModel = require('./../../models/tinh_thanh_pho.model');

module.exports.List = async function(req, res) {
    var doc = await tinhThanhModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        _id: ids.generate(),
        ten: req.body.ten,
        loai: req.body.loai
    }
    var doc = await tinhThanhModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var city = await tinhThanhModel.findOne({_id: id});
    res.json(city);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var obj = {
        ten: req.body.ten,
        loai: req.body.loai
    }
    var doc = await tinhThanhModel.updateOne({_id: id}, obj);
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var doc = await tinhThanhModel.deleteOne({_id: id});
    res.json(doc);
}