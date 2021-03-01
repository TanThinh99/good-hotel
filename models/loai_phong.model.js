var mongoose = require('mongoose');

var loaiPhongSchema = new mongoose.Schema({
    _id: String,
    ten: String,
    gia: Int32Array,
    so_luong: Int8Array,
    so_luong_con_lai: Int8Array,
    hinh_anh_360: String,
    disabled: Boolean,
    ma_khach_san: String
}, {
    versionKey: false
});

var loaiPhong = mongoose.model('loaiPhong', loaiPhongSchema, 'Loai_phong');

module.exports = loaiPhong;