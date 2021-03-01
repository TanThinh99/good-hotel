var mongoose = require('mongoose');

var hoaDonSchema = new mongoose.Schema({
    _id: String,
    ngay_dat_phong: Date,
    ngay_tra_phong: Date,
    ngay_het_han: Date,
    tien_thanh_toan_truoc: Int32Array,
    gia_dat_phong: Int32Array,
    trang_thai: Int8Array,
    ma_tai_khoan: String,
    ma_loai_phong: String
}, {
    versionKey: false
});

var hoaDon = mongoose.model('hoaDon', hoaDonSchema, 'Hoa_don');

module.exports = hoaDon;