var mongoose = require('mongoose');

var xaPhuongSchema = new mongoose.Schema({
    _id: String,
    ten: String,
    loai: String,
    maqh: String
}, {
    versionKey: false
});

var xaPhuong = mongoose.model('xaPhuong', xaPhuongSchema, 'Xa_phuong');

module.exports = xaPhuong;