var quanHuyenModel = require('./../../models/quan_huyen.model');

module.exports.list = async function(req, res) {
    var list = await quanHuyenModel.find();
    res.json(list);
}