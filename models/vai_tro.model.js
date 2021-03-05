var mongoose = require('mongoose');

var vaiTroSchema = new mongoose.Schema({
    ten: String,
    disabled: Boolean
}, {
    versionKey: false
});

var vaiTro = mongoose.model('vaiTro', vaiTroSchema, 'Vai_tro');

module.exports = vaiTro;