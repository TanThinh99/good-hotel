var sha = require('js-sha256');

var taiKhoanModel = require('./../../models/tai_khoan.model');

module.exports.List = async function(req, res) {
    var list = await taiKhoanModel.find();
    res.json(list);
}

module.exports.Add = function(req, res) {
    req.body.avatar = req.file.filename;
    req.body.password = sha(req.body.password);
    req.body.ma_khach_san = '';
    req.body.ma_vai_tro = 1;

    var result = taiKhoanModel.insertMany([req.body]);
    res.send('success');
}