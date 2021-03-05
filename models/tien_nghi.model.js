var mongoose = require('mongoose');

var tienNghiSchema = new mongoose.Schema({
    ten: String,
    hinh_anh: String
}, {
    versionKey: false
});

var tienNghi = mongoose.model('tienNghi', tienNghiSchema, 'Tien_nghi');

module.exports = tienNghi;