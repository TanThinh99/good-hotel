var axios = require('axios');

var loaiPhongModel = require('./../../models/loai_phong.model');
var hoaDonModel = require('./../../models/hoa_don.model');
var hinhAnhModel = require('./../../models/hinh_anh.model');

module.exports.List = async function(req, res) {
    var doc = await loaiPhongModel.find();
    res.json(doc);
}

module.exports.Add = async function(req, res) {
    var obj = {
        ten: req.body.ten,
        gia: req.body.gia,
        so_luong: req.body.so_luong,
        so_luong_con_lai: req.body.so_luong,
        hinh_anh_360: req.body.hinh_anh_360,
        ma_khach_san: req.body.ma_khach_san
    }
    obj.disabled = false;
    var doc = await loaiPhongModel.insertMany([obj]);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await loaiPhongModel.findById(id).exec();
    res.json(doc);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var obj = {
        ten: req.body.ten,
        gia: req.body.gia,
        so_luong: req.body.so_luong,
        // so_luong_con_lai: req.body.so_luong_con_lai,
        hinh_anh_360: req.body.hinh_anh_360,
        disabled: req.body.disabled
    }
    var doc = await loaiPhongModel.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var bills = await hoaDonModel.find({ma_loai_phong: id});
    if(bills.length == 0) {
        // Xóa hình ảnh
        var token = req.session.token;
        var docs = await hinhAnhModel.find({ma_loai_phong: id});
        for(i=0; i<docs.length; i++) {
            axios({
                method: 'DELETE',
                url: 'http://localhost:8000/api/hinh_anh/'+ docs[i]._id,
                headers: {
                    'Authorization': 'bearer '+ token
                }
            })
            .then(function(response) {})
            .catch(function(err) {
                console.log('Có lỗi xóa hình khi xóa loại phòng');
                console.log(err);
            });
        }
        // Xóa loại phòng
        var doc = await loaiPhongModel.findByIdAndDelete(id);
        res.json(doc);
    }
    else {
        // Vô hiệu hóa loại phòng
        var obj = {
            disabled: true
        }
        var doc = await loaiPhongModel.findByIdAndUpdate(id, obj, {new: true});
        res.json(doc);
    }    
}