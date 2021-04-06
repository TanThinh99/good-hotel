var mongoose = require('mongoose');
const khachSan = require('./khach_san.model');
const taiKhoan = require('./tai_khoan.model');

var binhLuanSchema = new mongoose.Schema({
    noi_dung_tot: String,
    noi_dung_xau: String,
    diem: Number,
    thoi_gian: String,
    noi_dung_phan_hoi: String,
    thoi_gian_phan_hoi: String,
    da_xem: Boolean,
    ma_tai_khoan: {
        type: String,
        ref: taiKhoan
    },
    ma_khach_san: {
        type: String,
        ref: khachSan
    }
}, {
    versionKey: false
});

var binhLuan = mongoose.model('binhLuan', binhLuanSchema, 'Binh_luan');

module.exports = binhLuan;