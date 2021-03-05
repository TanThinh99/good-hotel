var mongoose = require('mongoose');

var tienNghiKhachSanSchema = new mongoose.Schema({
    ma_tien_nghi: String,
    ma_khach_san: String
}, {
    versionKey: false
});

var tienNghiKhachSan = mongoose.model('tienNghiKhachSan', tienNghiKhachSanSchema, 'Tien_nghi_khach_san');

module.exports = tienNghiKhachSan;