var mongoose = require('mongoose');
const khachSan = require('./khach_san.model');

var loaiPhongSchema = new mongoose.Schema({
    ten: String,
    gia: Number,
    so_luong: Number,
    so_luong_con_lai: Number,
    hinh_anh_360: String,
    disabled: Boolean,
    ma_khach_san: {
        type: String,
        ref: khachSan
    }
}, {
    versionKey: false
});

var loaiPhong = mongoose.model('loaiPhong', loaiPhongSchema, 'Loai_phong');

module.exports = loaiPhong;