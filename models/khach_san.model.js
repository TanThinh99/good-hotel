var mongoose = require('mongoose');

var khachSanSchema = new mongoose.Schema({
    ten: String,
    dia_chi: String,
    so_dien_thoai: String,
    google_map: String,
    gia: Number,
    diem_trung_binh: Number,
    so_luong_binh_luan: Number,
    so_phong_con_lai: Number,
    maxp: String
}, {
    versionKey: false
});

var khachSan = mongoose.model('khachSan', khachSanSchema, 'Khach_san');

module.exports = khachSan;