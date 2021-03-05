var mongoose = require('mongoose');

var hinhAnhSchema = new mongoose.Schema({
    ten: String,
    ma_loai_phong: String,
    ma_khach_san: String
}, {
    versionKey: false
});

var hinhAnh = mongoose.model('hinhAnh', hinhAnhSchema, 'Hinh_anh');

module.exports = hinhAnh;