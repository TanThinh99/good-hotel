const khachSan = require('../../models/khach_san.model');
const loaiPhong = require('../../models/loai_phong.model');
var binhLuan = require('./../../models/binh_luan.model');
var hoaDon = require('./../../models/hoa_don.model');

module.exports.List = async function(req, res) {
    var doc = await binhLuan.find();
    res.json(doc);
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await binhLuan.findById(id).exec();
    res.json(doc);
}

function FormatNumberInDate(number) {
    if(number < 10) {
        return '0'+ number;
    }
    return number;
}

function GetTimeNow() {
    var d = new Date();
    var month = FormatNumberInDate(d.getMonth() + 1);
    var date = FormatNumberInDate(d.getDate());
    var hour = FormatNumberInDate(d.getHours());
    var minute = FormatNumberInDate(d.getMinutes());
    var second = FormatNumberInDate(d.getSeconds());
    return d.getFullYear() +"-"+ month +"-"+ date +" "+ hour +":"+ minute +":"+second;
}

async function UpdateScoreHotel(ma_khach_san) {
    var comments = await binhLuan.find({ma_khach_san: ma_khach_san});
    var score = 0;
    for(var i=0; i<comments.length; i++) {
        score += comments[i].diem;
    }
    score = score / comments.length;
    var arr = (score+'').split('.');
    var duoi;
    if(arr.length == 2) {
        duoi = arr[1].length > 1 ? arr[1].slice(0, 1) : arr[1];
        duoi = duoi.length == 1 ? duoi : '0';
    }
    else {
        duoi = '0';
    }
    score = arr[0] +'.'+ duoi;
    var hotel = await khachSan.findById(ma_khach_san);
    hotel.diem_trung_binh = score;
    hotel.so_luong_binh_luan = comments.length;
    hotel.save();
}

module.exports.MemberAdd = async function(req, res) {
    var decode = req.session.decode;
    var hotelID = req.body.ma_khach_san;
    var roomTypes = await loaiPhong.find({ma_khach_san: hotelID});
    var roomTypeIDArr = [];
    for(var i=0; i<roomTypes.length; i++) {
        roomTypeIDArr.push(roomTypes[i]._id);
    }
    var bill = await hoaDon.findOne({
        ma_tai_khoan: decode.id,
        da_tra_phong: true,
        ma_loai_phong: {$in: roomTypeIDArr}
    });
    if(bill == undefined) {
        res.send({err: 'Quý khách cần phải đặt phòng và sử dụng dịch vụ tại khách sạn này, quý khách mới có thể tạo bình luận cho khách sạn!'});
    }
    else {
        var obj = {
            noi_dung_tot: req.body.noi_dung_tot,
            noi_dung_xau: req.body.noi_dung_xau,
            diem: req.body.diem,
            thoi_gian: GetTimeNow(),
            noi_dung_phan_hoi: '',
            thoi_gian_phan_hoi: '',
            da_xem: false,
            ma_tai_khoan: decode.id,
            ma_khach_san: hotelID
        }
        var docs = await binhLuan.insertMany([obj]);
        UpdateScoreHotel(hotelID);
        res.json({
            err: '',
            comment: docs[0]
        });
    }
}

module.exports.MemberUpdate = async function(req, res) {
    var id = req.params.id;
    var obj = {
        noi_dung_tot: req.body.noi_dung_tot,
        noi_dung_xau: req.body.noi_dung_xau,
        diem: req.body.diem,
        thoi_gian: GetTimeNow()
    }
    var doc = await binhLuan.findByIdAndUpdate(id, obj, {new: true});
    UpdateScoreHotel(doc.ma_khach_san);
    res.json(doc);
}

module.exports.MemberDelete = async function(req, res) {
    var id = req.params.id;
    var doc = await binhLuan.findByIdAndDelete(id);
    UpdateScoreHotel(doc.ma_khach_san);
    res.json(doc);
}

module.exports.ManagerUpdate = async function(req, res) {
    var id = req.params.id;
    var obj = {
        noi_dung_phan_hoi: req.body.noi_dung_phan_hoi,
        thoi_gian_phan_hoi: GetTimeNow(),
        da_xem: true
    }
    if(req.body.noi_dung_phan_hoi == '') {
        obj.da_xem = false;
    }
    var doc = await binhLuan.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.ManagerDelete = async function(req, res) {
    var id = req.params.id;
    var obj = {
        noi_dung_phan_hoi: '',
        thoi_gian_phan_hoi: '',
        da_xem: false
    }
    var doc = await binhLuan.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}

module.exports.ConfirmSeen = async function(req, res) {
    var id = req.params.id;
    var obj = {
        da_xem: true
    }
    var doc = await binhLuan.findByIdAndUpdate(id, obj, {new: true});
    res.json(doc);
}