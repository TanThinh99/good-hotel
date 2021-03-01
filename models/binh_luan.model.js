var mongoose = require('mongoose');

var binhLuanSchema = new mongoose.Schema({
    _id: String,
    noi_dung_tot: String,
    noi_dung_xau: String,
    diem: Int8Array,
    thoi_gian: Date,
    noi_dung_phan_hoi: String,
    thoi_gian_phan_hoi: Date,
    da_xem: Boolean,
    ma_tai_khoan: String,
    ma_khach_san: String
}, {
    versionKey: false
});

var binhLuan = mongoose.model('binhLuan', binhLuanSchema, 'Binh_luan');

module.exports = binhLuan;