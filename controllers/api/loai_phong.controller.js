var axios = require('axios');

var loaiPhongModel = require('./../../models/loai_phong.model');
var hoaDonModel = require('./../../models/hoa_don.model');
var hinhAnhModel = require('./../../models/hinh_anh.model');
const khachSan = require('../../models/khach_san.model');

module.exports.List = async function(req, res) {
    var doc = await loaiPhongModel.find();
    res.json(doc);
}

async function UpdatePriceAndRoomHotel(hotelID) {
    var hotel = await khachSan.findById(hotelID);
    var roomTypes = await loaiPhongModel.find({ma_khach_san: hotelID, disabled: false});
    var minPrice = roomTypes.length == 0 ? 0 : roomTypes[0].gia;
    var so_phong_con_lai = 0;
    for(var i=0; i<roomTypes.length; i++) {
        if(minPrice > roomTypes[i].gia) {
            minPrice = roomTypes[i].gia;
        }
        so_phong_con_lai += roomTypes[i].so_luong_con_lai;
    }
    hotel.gia = minPrice;
    hotel.so_phong_con_lai = so_phong_con_lai;
    hotel.save();
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

    UpdatePriceAndRoomHotel(req.body.ma_khach_san);
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await loaiPhongModel.findById(id).exec();
    res.json(doc);
}

module.exports.Update = async function(req, res) {
    var id = req.params.id;
    var roomType = await loaiPhongModel.findById(id);
    roomType.so_luong_con_lai = req.body.so_luong*1 - (roomType.so_luong - roomType.so_luong_con_lai);
    roomType.ten = req.body.ten;
    roomType.gia = req.body.gia;
    roomType.so_luong = req.body.so_luong;
    roomType.hinh_anh_360 = req.body.hinh_anh_360;
    roomType.disabled = req.body.disabled;
    roomType.save();
    
    UpdatePriceAndRoomHotel(roomType.ma_khach_san)
    res.json(roomType);
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
        UpdatePriceAndRoomHotel(doc.ma_khach_san);
        res.json(doc);
    }
    else {
        // Vô hiệu hóa loại phòng
        var obj = {
            disabled: true
        }
        var doc = await loaiPhongModel.findByIdAndUpdate(id, obj, {new: true});
        UpdatePriceAndRoomHotel(doc.ma_khach_san);
        res.json(doc);
    }    
}