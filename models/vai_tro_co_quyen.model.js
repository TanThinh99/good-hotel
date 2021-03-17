var mongoose = require('mongoose');
const quyen = require('./quyen.model');
var Schema = mongoose.Schema;

var vaiTroCoQuyenSchema = Schema({
    ma_vai_tro: String,
    ma_quyen: { 
        type: String, 
        ref: quyen
    }
}, {
    versionKey: false
});

var vaiTroCoQuyen = mongoose.model('vaiTroCoQuyen', vaiTroCoQuyenSchema, 'Vai_tro_co_quyen');

module.exports = vaiTroCoQuyen;