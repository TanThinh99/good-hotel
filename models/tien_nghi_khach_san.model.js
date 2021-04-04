var mongoose = require('mongoose');
const tienNghi = require('./tien_nghi.model');

var tienNghiKhachSanSchema = new mongoose.Schema({
    ma_tien_nghi: {
        type: String,
        ref: tienNghi
    },
    ma_khach_san: String
}, {
    versionKey: false
});

var tienNghiKhachSan = mongoose.model('tienNghiKhachSan', tienNghiKhachSanSchema, 'Tien_nghi_khach_san');

module.exports = tienNghiKhachSan;