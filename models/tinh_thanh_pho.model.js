var mongoose = require('mongoose');

var tinhThanhPhoSchema = new mongoose.Schema({
    ten: String,
    loai: String
}, {
    versionKey: false
});

var tinhThanh = mongoose.model('tinhThanh', tinhThanhPhoSchema, 'Tinh_thanh_pho');

module.exports = tinhThanh;