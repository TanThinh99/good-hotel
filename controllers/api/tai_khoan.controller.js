var sha = require('js-sha256');
var fs = require('fs');

var taiKhoanModel = require('./../../models/tai_khoan.model');
var vaiTroModel = require('./../../models/vai_tro.model');
var khachSanModel = require('./../../models/khach_san.model');

module.exports.List = async function(req, res) {
    var docs = await taiKhoanModel.find();
    res.json(docs);
}

module.exports.Add = function(req, res) {
    var obj = {
        ho_ten: req.body.ho_ten,
        gioi_tinh: true,
        email: req.body.email,
        so_dien_thoai: req.body.so_dien_thoai,
        dia_chi: '',
        avatar: '',
        username: req.body.username,
        password: sha(req.body.password),
        ma_khach_san: '',
        maxp: ''
    }
    vaiTroModel.findOne({ ten: 'member' }, function(err, doc) {
        obj.ma_vai_tro = doc._id;
        // console.log(doc);

        taiKhoanModel.insertMany([obj], function(err, docs) {
            if (err) 
                throw console.log(err);
            else 
                res.send('success');
        });
    });    
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var account = await taiKhoanModel.findById(id);
    res.json(account);
}

module.exports.UpdateInfo = function(req, res) {
    var id = req.params.id;
    taiKhoanModel.findById(id, function(err, doc) {
        doc.ho_ten = req.body.ho_ten;
        doc.gioi_tinh = req.body.gioi_tinh;
        doc.so_dien_thoai = req.body.so_dien_thoai;
        doc.dia_chi = req.body.dia_chi;
        doc.maxp = req.body.maxp;

        if (req.file != undefined) {
            // Xóa hình cũ
            var oldImage = doc.avatar;
            if(oldImage != '') {
                // Có tồn tại avatar
                fs.unlink('./public/uploads/'+ oldImage, function(err) {
                    if (err) throw err;
                    console.log('File deleted!');
                });
            }  
            doc.avatar = req.file.filename;
        }
        doc.save();
        res.send('Update success!');
    });
}

module.exports.UpdateAccount = function(req, res) {
    var id = req.params.id;
    taiKhoanModel.findById(id, function(err, doc) {
        doc.email = req.body.email;
        doc.password = sha(req.body.password);
        doc.save();
        res.send('Update account success!');
    });
}

module.exports.GrantRole = async function(req, res) {
    var id = req.params.id;
    var objAccount = {
        ma_vai_tro: req.body.ma_vai_tro
    }
    if (req.body.ma_khach_san != null) {
        // Tạo khách sạn mới
        var obj = {
            ten: '',
            dia_chi: '',
            so_dien_thoai: '',
            google_map: '',
            gia: 0,
            diem_trung_binh: 0,
            so_luong_binh_luan: 0,
            so_phong_con_lai: 0,
            maxp: ''
        }
        var doc = await khachSanModel.insertMany([obj]);
        objAccount.ma_khach_san = doc[0]._id;
    }
    else {
        objAccount.ma_khach_san = '';
    }
    var result = await taiKhoanModel.findByIdAndUpdate(id, objAccount, {new: true});
    res.send(result);
}

module.exports.GrantHotelForManager = async function(req, res) {
    var managerID = req.body.managerID;
    var account = await taiKhoanModel.findById(managerID);
    account.ma_khach_san = req.body.hotelID;
    account.save();
    res.send(account);
}