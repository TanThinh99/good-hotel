var mongoose = require('mongoose');

var quanHuyenSchema = new mongoose.Schema({
    _id: String,
    ten: String,
    loai: String,
    matp: String
}, {
    versionKey: false
});

var quanHuyen = mongoose.model('quanHuyen', quanHuyenSchema, 'Quan_huyen');

module.exports = quanHuyen;