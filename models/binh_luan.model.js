var mongoose = require('mongoose');

var binhLuanSchema = new mongoose.Schema({
    noi_dung_tot: String,
    noi_dung_xau: String,
    diem: Number,
    thoi_gian: String,
    noi_dung_phan_hoi: String,
    thoi_gian_phan_hoi: String,
    da_xem: Boolean,
    ma_tai_khoan: String,
    ma_khach_san: String
}, {
    versionKey: false
});

var binhLuan = mongoose.model('binhLuan', binhLuanSchema, 'Binh_luan');

module.exports = binhLuan;