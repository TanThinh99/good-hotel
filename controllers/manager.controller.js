var axios = require('axios');

var taiKhoan = require('./../models/tai_khoan.model');
var tinhThanh = require('./../models/tinh_thanh_pho.model');
var quanHuyen = require('./../models/quan_huyen.model');
var xaPhuong = require('./../models/xa_phuong.model');
var khachSan = require('./../models/khach_san.model');
var hinhAnh = require('./../models/hinh_anh.model');
const loaiPhong = require('../models/loai_phong.model');
const hoaDon = require('../models/hoa_don.model');

module.exports.Hotel = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    var hotel = await khachSan.findById(decode.hotelID);
    params.hotel = hotel;
    var cities = await tinhThanh.find();
    params.cities = cities;
    
    // token
    params.token = req.session.token;
    params.csrfToken = req.session.csrfToken;

    if(hotel.maxp != '') {
        // Nếu đã có địa chỉ
        var wardOfHotel = await xaPhuong.findOne({_id: hotel.maxp});
        var distOfHotel = await quanHuyen.findOne({_id: wardOfHotel.maqh});
        var cityOfHotel = await tinhThanh.findOne({_id: distOfHotel.matp});
        var districts = await quanHuyen.find({matp: cityOfHotel._id});
        var wards = await xaPhuong.find({maqh: distOfHotel._id});
        params.wardOfHotel = wardOfHotel;
        params.distOfHotel = distOfHotel;
        params.cityOfHotel = cityOfHotel;
        params.districts = districts;  
        params.wards = wards;

        // street name
        var address = hotel.dia_chi;
        var addressArr = address.split(',');
        var streetName = addressArr.slice(0, addressArr.length-3).join();
        params.streetName = streetName;    
    }
    var imagesHotel = await hinhAnh.find({ma_khach_san: hotel._id});
    params.imagesHotel = imagesHotel;
    params.amountImagesHotel = imagesHotel.length;
    res.render('manager/hotel', params);
}

module.exports.Convenient = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    res.render('manager/convenient', params);
}

module.exports.RoomType = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    params.token = req.session.token;
    var roomTypes = await loaiPhong.find({ma_khach_san: decode.hotelID});
    for(i=0; i<roomTypes.length; i++) {
        var imagesRoomType = await hinhAnh.find({ma_loai_phong: roomTypes[i]._id});
        roomTypes[i].images = imagesRoomType;
        roomTypes[i].amountImage = imagesRoomType.length; 
    }
    params.roomTypes = roomTypes;
    res.render('manager/roomType', params);
}

module.exports.UpdateRoomType = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    params.token = req.session.token;
    params.csrfToken = req.session.csrfToken;

    var roomTypeID = req.params.roomTypeID;
    var roomType = await loaiPhong.findById(roomTypeID);
    params.roomType = roomType;

    var imagesRoomType = await hinhAnh.find({ma_loai_phong: roomTypeID});
    params.imagesRoomType = imagesRoomType;
    params.amountImagesRoomType = imagesRoomType.length;
    res.render('manager/updateRoomType', params);
}

module.exports.AddRoomType = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    params.hotelID = decode.hotelID;
    params.token = req.session.token;
    params.csrfToken = req.session.csrfToken;
    res.render('manager/addRoomType', params);
}

function FormatNumberInDate(number) {
    if(number < 10) {
        return '0'+ number;
    }
    return number;
}

module.exports.CheckRoom = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    var roomTypes = await loaiPhong.find({ma_khach_san: decode.hotelID});
    var roomTypeIDArr = [];
    for(i=0; i<roomTypes.length; i++) {
        roomTypeIDArr.push(roomTypes[i].id);
    }
    var date = new Date();
    var month = FormatNumberInDate(date.getMonth() + 1);
    var day = FormatNumberInDate(date.getDate());
    var today = date.getFullYear() +'-'+ month +'-'+ day;
    params.today = today;
    var bills = await hoaDon.find({
        ma_loai_phong: {$in: roomTypeIDArr},
        ngay_tra_phong: {$gte: today},
        da_tra_phong: false
    }).populate('ma_loai_phong').populate('ma_tai_khoan').sort({da_thanh_toan: 1});
    params.bills = bills;    
    res.render('manager/checkRoom', params);
}

module.exports.Comment = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    res.render('manager/comment', params);
}

module.exports.ReplyComment = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    res.render('manager/replyComment', params);
}

module.exports.Bill = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    var roomTypes = await loaiPhong.find({ma_khach_san: decode.hotelID});
    var roomTypeIDArr = [];
    for(i=0; i<roomTypes.length; i++) {
        roomTypeIDArr.push(roomTypes[i].id);
    }
    var bills = await hoaDon.find({
        ma_loai_phong: {$in: roomTypeIDArr},
        da_tra_phong: true
    }).populate('ma_loai_phong').populate('ma_tai_khoan').sort({ngay_dat_phong: 1});
    params.bills = bills;
    res.render('manager/bill', params);
}

module.exports.BillDetail = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    var billID = req.params.billID;
    var bill = await hoaDon.findById(billID).populate('ma_loai_phong').populate('ma_tai_khoan');
    params.bill = bill;
    res.render('manager/billDetail', params);
}

// ================= A J A X =================
    // Check Room
module.exports.DestroyBill = async function(req, res) {
    var billID = req.body.billID;
    await hoaDon.findByIdAndDelete(billID);
    res.sendStatus(200);
}

module.exports.ReturnRoom = async function(req, res) {
    var billID = req.body.billID;
    var bill = await hoaDon.findById(billID);
    // var roomAmount = bill.so_luong_phong;

    bill.da_tra_phong = true;
    bill.save();
    res.sendStatus(200);
}