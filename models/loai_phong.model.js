var mongoose = require('mongoose');

var loaiPhongSchema = new mongoose.Schema({
    ten: String,
    gia: Number,
    so_luong: Number,
    so_luong_con_lai: Number,
    hinh_anh_360: String,
    disabled: Boolean,
    ma_khach_san: String
}, {
    versionKey: false
});

var loaiPhong = mongoose.model('loaiPhong', loaiPhongSchema, 'Loai_phong');

module.exports = loaiPhong;