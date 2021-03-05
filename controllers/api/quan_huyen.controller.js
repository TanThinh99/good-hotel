var ids = require('short-id');

var quanHuyenModel = require('./../../models/quan_huyen.model');

module.exports.List = async function(req, res) {
    var doc = await quanHuyenModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        _id: ids.generate(),
        ten: req.body.ten,
        loai: req.body.loai,
        matp: req.body.matp
    }
    var doc = await quanHuyenModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await quanHuyenModel.findOne({_id: id});
    res.json(doc);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var obj = {
        ten: req.body.ten,
        loai: req.body.loai,
        matp: req.body.matp
    }
    var doc = await quanHuyenModel.updateOne({_id: id}, obj);
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var doc = await quanHuyenModel.deleteOne({_id: id});
    res.json(doc);
}