var sha = require('js-sha256');
var jwt = require('jsonwebtoken');
const vaiTroCoQuyen = require('../../models/vai_tro_co_quyen.model');
var taiKhoanModel = require('./../../models/tai_khoan.model');

module.exports.PostLoginTest = async function(req, res) {
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

module.exports.PostLogin = async function(req, res) {
    var uid = req.body.uid;
    var pass = sha(req.body.pass);

    var rs = await taiKhoanModel.findOne({username: uid, password: pass}).exec();
    if(rs == null) {
        res.json({'access': '0'});
    }
    else {
        // id của quyền: Vao trang admin
        var adminPageID = '6056bdebaeec781fe47d7c54';

        // id của quyền: Vao trang quan ly khach san
        var managerPageID = '6056be0baeec781fe47d7c55';

        var allow = '';
        var hasPermiss = await vaiTroCoQuyen.findOne({ma_vai_tro: rs.ma_vai_tro, ma_quyen: adminPageID}).exec();
        if(hasPermiss != null) {
            allow = 'Vao trang admin';
        }
        else {
            var hasPermiss = await vaiTroCoQuyen.findOne({ma_vai_tro: rs.ma_vai_tro, ma_quyen: managerPageID}).exec();
            if((hasPermiss != null) && (rs.ma_khach_san != '')) {
                allow = 'Vao trang quan ly khach san';
            }
        }

        var content = {
            id: rs._id,
            role: rs.ma_vai_tro,
            allow: allow,
            hotelID: rs.ma_khach_san
        }
        jwt.sign(content, process.env.SECRET_JWT, {expiresIn: '6h'}, function(err, token) {
            req.session.decode = content;
            req.session.token = token;
            if(allow == 'Vao trang admin') {
                res.json({'access': '/admin'});
            }
            else if(allow == 'Vao trang quan ly khach san') {
                res.json({'access': '/manager'});
            }
            else {
                res.json({'access': ''});
            }
        });        
    }  
}