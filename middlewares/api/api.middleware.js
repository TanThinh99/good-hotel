var jwt = require('jsonwebtoken');

var quyenModel = require('./../../models/quyen.model');
var vaiTroModel = require('./../../models/vai_tro.model');
var vaiTroCoQuyenModel = require('./../../models/vai_tro_co_quyen.model');

module.exports.CheckLogin = function(req, res, next) {
    var authorization = req.headers.authorization;
    if (authorization == undefined) {
        res.json({announ: "You need to enter your token!"});
    }    
    else {
        var token = authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_JWT, function(err, decode) {
            if (err) {
                console.log(err);
                res.json({announ: "Token is invalid"});
            }
            else {
                req.session.decode = decode;
                next();
            }
        });
    }    
}

async function CheckPermission(func, req, res, next) {
    var decode = req.session.decode;
    var permission = await quyenModel.findOne({ ten: func }).exec();
    var havePermiss = await vaiTroCoQuyenModel.findOne({ ma_quyen: permission._id, ma_vai_tro: decode.role }).exec();
    var role = await vaiTroModel.findById(decode.role).exec();
    if ((havePermiss != null) && (role.disabled == false)) {
        next();
    }
    else {
        res.sendStatus(403);
    }        
}

//  Tiện nghi
module.exports.AddTienNghi = function(req, res, next) {
    var func = 'Them tien nghi';
    CheckPermission(func, req, res, next);
}

module.exports.UpdateTienNghi = async function(req, res, next) {
    var func = 'Sua tien nghi';
    CheckPermission(func, req, res, next);
}

module.exports.DeleteTienNghi = async function(req, res, next) {
    var func = 'Xoa tien nghi';
    CheckPermission(func, req, res, next);
}

// Khách sạn
module.exports.AddKhachSan = function(req, res, next) {
    var func = 'Them khach san';
    CheckPermission(func, req, res, next);
}

module.exports.UpdateKhachSan = function(req, res, next) {
    var func = 'Sua khach san';
    CheckPermission(func, req, res, next);
}

module.exports.DeleteKhachSan = function(req, res, next) {
    var func = 'Xoa khach san';
    CheckPermission(func, req, res, next);
}

// Vai trò
module.exports.AddVaiTro = function(req, res, next) {
    var func = 'Them vai tro';
    CheckPermission(func, req, res, next);
}

module.exports.UpdateVaiTro = function(req, res, next) {
    var func = 'Sua vai tro';
    CheckPermission(func, req, res, next);
}

module.exports.DeleteVaiTro = function(req, res, next) {
    var func = 'Xoa vai tro';
    CheckPermission(func, req, res, next);
}

// Vai trò có quyền
module.exports.AddVaiTroCoQuyen = function(req, res, next) {
    var func = 'Them quyen cho vai tro';
    CheckPermission(func, req, res, next);
}

module.exports.DeleteVaiTroCoQuyen = function(req, res, next) {
    var func = 'Xoa quyen cua vai tro';
    CheckPermission(func, req, res, next);
}

// Hình ảnh
module.exports.AddHinhAnh = function(req, res, next) {
    var func = 'Them hinh anh';
    CheckPermission(func, req, res, next);
}

module.exports.DeleteHinhAnh = function(req, res, next) {
    var func = 'Xoa hinh anh';
    CheckPermission(func, req, res, next);
}

// Loại phòng
module.exports.AddLoaiPhong = function(req, res, next) {
    var func = 'Them loai phong';
    CheckPermission(func, req, res, next);
}

module.exports.UpdateLoaiPhong = function(req, res, next) {
    var func = 'Sua loai phong';
    CheckPermission(func, req, res, next);
}

module.exports.DeleteLoaiPhong = function(req, res, next) {
    var func = 'Xoa loai phong';
    CheckPermission(func, req, res, next);
}

// Tiện nghi khách sạn
module.exports.AddTienNghiKS = function(req, res, next) {
    var func = 'Them tien nghi khach san';
    CheckPermission(func, req, res, next);
}

module.exports.DeleteTienNghiKS = function(req, res, next) {
    var func = 'Xoa tien nghi khach san';
    CheckPermission(func, req, res, next);
}

// Tài khoản
module.exports.UpdateTaiKhoan = function(req, res, next) {
    var decode = req.session.decode;
    var accountID = req.params.id;
    if(accountID == decode.id) {
        next();
    }
    else {
        res.sendStatus(403);
    }
}

module.exports.GrantRole = function(req, res, next) {
    var func = 'Cap vai tro';
    CheckPermission(func, req, res, next);
}

module.exports.GrantHotelForManager = function(req, res, next) {
    var func = 'Cap quyen quan ly khach san';
    CheckPermission(func, req, res, next);
}