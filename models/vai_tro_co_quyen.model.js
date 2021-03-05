var mongoose = require('mongoose');

var vaiTroCoQuyenSchema = new mongoose.Schema({
    ma_vai_tro: String,
    ma_quyen: String
}, {
    versionKey: false
});

var vaiTroCoQuyen = mongoose.model('vaiTroCoQuyen', vaiTroCoQuyenSchema, 'Vai_tro_co_quyen');

module.exports = vaiTroCoQuyen;