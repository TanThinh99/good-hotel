var mongoose = require('mongoose');

var hoaDonSchema = new mongoose.Schema({
    ngay_dat_phong: String,
    ngay_tra_phong: String,
    ngay_het_han: String,
    tien_thanh_toan_truoc: Number,
    gia_dat_phong: Number,
    ma_tai_khoan: String,
    ma_loai_phong: String
}, {
    versionKey: false
});

var hoaDon = mongoose.model('hoaDon', hoaDonSchema, 'Hoa_don');

module.exports = hoaDon;