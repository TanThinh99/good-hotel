var mongoose = require('mongoose');
const loaiPhong = require('./loai_phong.model');
const taiKhoan = require('./tai_khoan.model');

var hoaDonSchema = new mongoose.Schema({
    ngay_dat_phong: String,
    ngay_nhan_phong: String,
    ngay_tra_phong: String,
    gia_dat_phong: Number,
    so_luong_phong: Number,
    da_thanh_toan: Boolean,
    da_tra_phong: Boolean,
    ma_tai_khoan: {
        type: String,
        ref: taiKhoan
    },
    ma_loai_phong: {
        type: String,
        ref: loaiPhong
    }
}, {
    versionKey: false
});

var hoaDon = mongoose.model('hoaDon', hoaDonSchema, 'Hoa_don');

module.exports = hoaDon;