var mongoose = require('mongoose');

var vaiTroSchema = new mongoose.Schema({
    _id: String,
    ten: String,
    disabled: Boolean
}, {
    versionKey: false
});

var vaiTro = mongoose.model('vaiTro', vaiTroSchema, 'Vai_tro');

module.exports = vaiTro;