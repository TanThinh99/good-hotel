var mongoose = require('mongoose');

var khachSanSchema = new mongoose.Schema({
    _id: String,
    ten: String,
    dia_chi: String,
    so_dien_thoai: String,
    google_map: String,
    gia: Int32Array,
    diem_trung_binh: Float32Array,
    so_luong_binh_luan: Int8Array,
    so_phong_con_lai: Int8Array,
    maxp: String
}, {
    versionKey: false
});

var khachSan = mongoose.model('khachSan', khachSanSchema, 'Khach_san');

module.exports = khachSan;