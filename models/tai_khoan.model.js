var mongoose = require('mongoose');

var taiKhoanSchema = new mongoose.Schema({
    ho_ten: String,
    gioi_tinh: Boolean,
    email: String,
    so_dien_thoai: String,
    dia_chi: String,
    avatar: String,
    username: String,
    password: String,
    ma_khach_san: String,
    ma_vai_tro: String,
    maxp: String
}, {
    versionKey: false
});

var taiKhoan = mongoose.model('taiKhoan', taiKhoanSchema, 'Tai_khoan');

module.exports = taiKhoan;