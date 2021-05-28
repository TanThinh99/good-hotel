var jwt = require('jsonwebtoken');
const khachSan = require('../../models/khach_san.model');

const loaiPhong = require('../../models/loai_phong.model');
var hoaDonModel = require('./../../models/hoa_don.model');

module.exports.List = async function(req, res) {
    var doc = await hoaDonModel.find();
    res.json(doc);
}

function FormatNumberInDate(number) {
    if(number < 10) {
        return '0'+ number;
    }
    return number;
}

module.exports.Add = async function(req, res) {
    var date = new Date();
    var month = FormatNumberInDate(date.getMonth() + 1);
    var day = FormatNumberInDate(date.getDate());
    var hour = FormatNumberInDate(date.getHours());
    var minute = FormatNumberInDate(date.getMinutes());
    var second = FormatNumberInDate(date.getSeconds());    
    var time = date.getFullYear() +"-"+ month +"-"+ day +" "+ hour +":"+ minute +":"+ second;

    var objArr = [];
    var decode = req.session.decode;
    var basket = req.session.basket;
    basket = basket == undefined ? [] : basket;
    for(i=0; i<basket.length; i++) {
        var obj = {
            ngay_dat_phong: time,
            ngay_nhan_phong: basket[i].fromDate,
            ngay_tra_phong: basket[i].toDate,
            gia_dat_phong: basket[i].roomType.gia,
            so_luong_phong: basket[i].amountRoom,
            da_thanh_toan: false,
            da_tra_phong: false,
            ma_tai_khoan: decode.id,
            ma_loai_phong: basket[i].roomType._id
        }
        objArr.push(obj);

        // reduce amountRoom in roomType and hotel
        var roomType = await loaiPhong.findById(basket[i].roomType._id);
        roomType.so_luong_con_lai = roomType.so_luong_con_lai - basket[i].amountRoom;
        roomType.save();
        var hotel = await khachSan.findById(roomType.ma_khach_san);
        hotel.so_phong_con_lai = hotel.so_phong_con_lai - basket[i].amountRoom;
        hotel.save();
    }
    req.session.basket = [];       
    var docs = await hoaDonModel.insertMany(objArr);
    res.json(docs);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await hoaDonModel.findById(id).exec();
    res.json(doc);
}