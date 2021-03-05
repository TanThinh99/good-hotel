var tienNghiModel = require('./../../models/tien_nghi.model');

module.exports.List = async function(req, res) {
    var doc = await tienNghiModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        ten: req.body.ten,
        hinh_anh: req.body.hinh_anh
    }
    var doc = await tienNghiModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await tienNghiModel.findById(id).exec();
    res.json(doc);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var obj = {
        ten: req.body.ten,
        hinh_anh: req.body.hinh_anh
    }
    var doc = await tienNghiModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var doc = await tienNghiModel.findByIdAndDelete(id);
    res.json(doc);
}