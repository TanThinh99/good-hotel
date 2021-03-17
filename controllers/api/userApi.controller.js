var sha = require('js-sha256');
var jwt = require('jsonwebtoken');

var taiKhoanModel = require('./../../models/tai_khoan.model');

module.exports.PostLogin = async function(req, res) {
    var uid = req.body.uid;
    var pass = sha(req.body.pass);

    var rs = await taiKhoanModel.find({username: uid, password: pass}).exec();
    if(rs.length == 0) {
        res.json({'access': '0'});
    }
    else {
        var content = {
            id: rs[0]._id,
            role: rs[0].ma_vai_tro
        }
        jwt.sign(content, process.env.SECRET_JWT, {expiresIn: '6h'}, function(err, token) {
            req.session.token = token;
            res.json({'access': token});
        });        
    }  
}

module.exports.Logout = function(req, res) {
    req.session.token = null;
    res.redirect('http://localhost:8000/login');
}