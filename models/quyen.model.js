var mongoose = require('mongoose');

var quyenSchema = new mongoose.Schema({
    ten: String
}, {
    versionKey: false
});

var quyen = mongoose.model('quyen', quyenSchema, 'Quyen');

module.exports = quyen;