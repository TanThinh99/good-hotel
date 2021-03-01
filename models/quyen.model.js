var mongoose = require('mongoose');

var quyenSchema = new mongoose.Schema({
    _id: String,
    ten: String
}, {
    versionKey: false
});

var quyen = mongoose.model('quyen', quyenSchema, 'Quyen');

module.exports = quyen;