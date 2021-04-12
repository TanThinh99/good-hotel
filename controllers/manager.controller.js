var axios = require('axios');

var taiKhoan = require('./../models/tai_khoan.model');
var tinhThanh = require('./../models/tinh_thanh_pho.model');
var quanHuyen = require('./../models/quan_huyen.model');
var xaPhuong = require('./../models/xa_phuong.model');
var khachSan = require('./../models/khach_san.model');
var hinhAnh = require('./../models/hinh_anh.model');
const loaiPhong = require('../models/loai_phong.model');
const hoaDon = require('../models/hoa_don.model');
const tienNghiKhachSan = require('../models/tien_nghi_khach_san.model');
const tienNghi = require('../models/tien_nghi.model');
const binhLuan = require('../models/binh_luan.model');

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
    var hotelID = decode.hotelID;
    params.hotelID = hotelID;
    var convens = await tienNghiKhachSan.find({ma_khach_san: hotelID}).populate('ma_tien_nghi');
    params.convens = convens;
    var convenIDArr = [];
    for(i=0; i<convens.length; i++) {
        convenIDArr.push(convens[i].ma_tien_nghi);
    }
    var notConvens = await tienNghi.find({_id: {$nin: convenIDArr}});
    params.notConvens = notConvens;
    params.token = req.session.token;
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
    var bills, billKey = req.query.key;
    if(billKey == undefined) {
        bills = await hoaDon.find({
            ma_loai_phong: {$in: roomTypeIDArr},
            ngay_tra_phong: {$gte: today},
            da_tra_phong: false
        }).populate('ma_loai_phong').populate('ma_tai_khoan').sort({da_thanh_toan: 1});
    }
    else {
        bills = await hoaDon.find({
            ma_loai_phong: {$in: roomTypeIDArr},
            ngay_tra_phong: {$gte: today},
            da_tra_phong: false
        }).populate('ma_loai_phong').populate('ma_tai_khoan').sort({da_thanh_toan: 1});
        var tempArr = [];
        params.foundByKey = billKey;
        billKey = billKey.toLowerCase();
        for(var i=0; i<bills.length; i++) {
            var ho_ten = bills[i].ma_tai_khoan.ho_ten.toLowerCase();
            if(ho_ten.indexOf(billKey) != -1) {
                tempArr.push(bills[i]);
            }
        }
        bills = tempArr;
    }
    params.bills = bills;    
    res.render('manager/checkRoom', params);
}

module.exports.Comment = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    var comments, commentKey = req.query.key;
    if(commentKey == undefined) {
        comments = await binhLuan.find({ma_khach_san: decode.hotelID})
            .populate('ma_tai_khoan')
            .sort({da_xem: 1, thoi_gian: -1});
    }
    else {
        comments = await binhLuan.find({ma_khach_san: decode.hotelID})
            .populate('ma_tai_khoan')
            .sort({da_xem: 1, thoi_gian: -1});
        var tempArr = [];
        params.foundByKey = commentKey;
        commentKey = commentKey.toLowerCase();
        for(var i=0; i<comments.length; i++) {
            var ho_ten = comments[i].ma_tai_khoan.ho_ten.toLowerCase();
            if(ho_ten.indexOf(commentKey) != -1) {
                tempArr.push(comments[i]);
            }
        }
        comments = tempArr;
    }

    // Pagination
    var amountItemInPage = 8;
    var itemTotal = comments.length;
    var pageTotal = parseInt(itemTotal / amountItemInPage);
    if(itemTotal % amountItemInPage != 0) {
        pageTotal++;
    }
    var amountShowPage = pageTotal > 7 ? 7 : pageTotal;
    params.amountShowPage = amountShowPage;
    params.pageTotal = pageTotal;
    var commentArr = [];
    for(var i=0; i<amountItemInPage; i++) {
        if(comments[i] == undefined) {
            break;
        }
        commentArr.push(comments[i]);
    }
    params.comments = commentArr;
    params.token = req.session.token;
    res.render('manager/comment', params);
}

module.exports.ReplyComment = async function(req, res) {
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    var params = {
        account: account
    }
    var commentID = req.params.commentID;
    params.commentID = commentID;
    var comment = await binhLuan.findById(commentID).populate('ma_tai_khoan');
    params.comment = comment;
    params.token = req.session.token;
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

    var bills, billKey = req.query.key;
    if(billKey == undefined) {
        bills = await hoaDon.find({
            ma_loai_phong: {$in: roomTypeIDArr},
            da_tra_phong: true
        }).populate('ma_loai_phong').populate('ma_tai_khoan').sort({ngay_dat_phong: 1});
    }
    else {
        bills = await hoaDon.find({
            ma_loai_phong: {$in: roomTypeIDArr},
            da_tra_phong: true
        }).populate('ma_loai_phong').populate('ma_tai_khoan').sort({ngay_dat_phong: 1});
        var tempArr = [];
        params.foundByKey = billKey;
        billKey = billKey.toLowerCase();
        for(var i=0; i<bills.length; i++) {
            var billID = (bills[i]._id +'').toLowerCase();
            var ho_ten = bills[i].ma_tai_khoan.ho_ten.toLowerCase();
            if((billID.indexOf(billKey) != -1) || (ho_ten.indexOf(billKey) != -1)) {
                tempArr.push(bills[i]);
            }
        }
        bills = tempArr;
    }

    // Pagination
    var amountItemInPage = 6;
    var itemTotal = bills.length;
    var pageTotal = parseInt(itemTotal / amountItemInPage);
    if(itemTotal % amountItemInPage != 0) {
        pageTotal++;
    }
    var amountShowPage = pageTotal > 3 ? 3 : pageTotal;
    params.amountShowPage = amountShowPage;
    params.pageTotal = pageTotal;
    var billArr = [];
    for(var i=0; i<amountItemInPage; i++) {
        if(bills[i] == undefined) {
            break;
        }
        billArr.push(bills[i]);
    }
    params.bills = billArr;
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

module.exports.GetCommentForPagination = async function(req, res) {
    var decode = req.session.decode;
    var comments, commentKey = req.query.key;
    if(commentKey == undefined) {
        comments = await binhLuan.find({ma_khach_san: decode.hotelID})
            .populate('ma_tai_khoan')
            .sort({da_xem: 1, thoi_gian: -1});
    }
    else {
        comments = await binhLuan.find({ma_khach_san: decode.hotelID})
            .populate('ma_tai_khoan')
            .sort({da_xem: 1, thoi_gian: -1});
        var tempArr = [];
        commentKey = commentKey.toLowerCase();
        for(var i=0; i<comments.length; i++) {
            var ho_ten = comments[i].ma_tai_khoan.ho_ten.toLowerCase();
            if(ho_ten.indexOf(commentKey) != -1) {
                tempArr.push(comments[i]);
            }
        }
        comments = tempArr;
    }

    // Pagination
    var pageSelected = req.query.pageSelected * 1;
    var amountItemInPage = 8;
    var itemTotal = comments.length;
    var pageTotal = parseInt(itemTotal / amountItemInPage);
    if(itemTotal % amountItemInPage != 0) {
        pageTotal++;
    }
    var amountShowPage = pageTotal > 7 ? 7 : pageTotal;
    var itemFrom = (pageSelected * amountItemInPage) - amountItemInPage;
    var itemTo = (pageSelected * amountItemInPage) - 1;
    var commentArr = [];
    for(var i=itemFrom; i<=itemTo; i++) {
        if(comments[i] == undefined) {
            break;
        }
        commentArr.push(comments[i]);
    }
    var pageFrom, pageTo;
    if((pageSelected-3 > 1) && (pageSelected+3 < pageTotal)) {
        pageFrom = pageSelected - 3;
        pageTo = pageSelected + 3;
    }
    else {
        if(pageSelected-3 <= 1) {
            pageFrom = 1;
            pageTo = amountShowPage;
        }
        else if(pageSelected+3 >= pageTotal) {
            pageFrom = pageTotal-6 < 1 ? 1 : pageTotal-6;
            pageTo = pageTotal;
        }
    }
    var commentData = '';
    for(i=0; i<commentArr.length; i++) {
        var daXemStr = '';
        if(commentArr[i].da_xem == false) {
            daXemStr = '<button class="btn btn-warning" onclick="DaXem(\''+ commentArr[i]._id +'\')">\
                            <i class="fa fa-eye" aria-hidden="true"></i>Đã xem\
                        </button>';
        }
        commentData += '<div class="col-lg-11 col-md-6 btn-icon-clipboard mx-auto comment">\
                            <div class="row">\
                                <div class="col-6 title">\
                                    <span class="username">'+ commentArr[i].ma_tai_khoan.ho_ten +'</span>\
                                    <span class="score">'+ commentArr[i].diem +'.0</span>\
                                </div>\
                                <div class="col-6 text-right">\
                                    <span class="time">'+ commentArr[i].thoi_gian +'</span>\
                                </div>\
                                </div>\
                                <p class="good">\
                                    <span>Tốt: </span>'+ commentArr[i].noi_dung_tot +'\
                                </p>\
                                <p class="bad">\
                                    <span>Góp ý: </span>'+ commentArr[i].noi_dung_xau +'\
                                </p>\
                                <div class="funcs">'+ daXemStr +'\
                                    <a href="./replyComment/'+ commentArr[i]._id +'">\
                                        <button class="btn btn-light">\
                                            <i class="fa fa-reply" aria-hidden="true"></i>Phản hồi\
                                        </button>\
                                    </a>\
                                </div>\
                            </div>';
    }
    var paginateData = '';
    var classTemp = pageSelected == 1 ? 'disabled' : '';
    paginateData += '<li class="page-item '+ classTemp +'">\
                        <a class="page-link" aria-label="Previous" onclick="ChoosePaginateItem('+ 1 +')" title="1">\
                            <span aria-hidden="true"> &laquo;</span>\
                        </a>\
                    </li>';
    for(var i=pageFrom; i<=pageTo; i++) {
        if(i == pageSelected) {
            paginateData += '<li class="page-item active">\
                                <a class="page-link">'+ i +'</a>\
                            </li>';
        }
        else {
            paginateData += '<li class="page-item">\
                                <a class="page-link" style="cursor:pointer;" onclick="ChoosePaginateItem('+ i +')">'+ i +'</a>\
                            </li>';
        }
    }
    classTemp = pageTotal == pageSelected ? 'disabled' : '';
    paginateData += '<li class="page-item '+ classTemp +'">\
                        <a class="page-link" aria-label="Next" onclick="ChoosePaginateItem('+ pageTotal +')" title="'+ pageTotal +'">\
                            <span aria-hidden="true"> &raquo;</span>\
                        </a>\
                    </li>';
    res.send({
        commentData: commentData,
        paginateData: paginateData
    });
}

module.exports.GetBillForPagination = async function(req, res) {
    var decode = req.session.decode;
    var roomTypes = await loaiPhong.find({ma_khach_san: decode.hotelID});
    var roomTypeIDArr = [];
    for(i=0; i<roomTypes.length; i++) {
        roomTypeIDArr.push(roomTypes[i].id);
    }

    var bills, billKey = req.query.key;
    if(billKey == undefined) {
        bills = await hoaDon.find({
            ma_loai_phong: {$in: roomTypeIDArr},
            da_tra_phong: true
        }).populate('ma_loai_phong').populate('ma_tai_khoan').sort({ngay_dat_phong: 1});
    }
    else {
        bills = await hoaDon.find({
            ma_loai_phong: {$in: roomTypeIDArr},
            da_tra_phong: true
        }).populate('ma_loai_phong').populate('ma_tai_khoan').sort({ngay_dat_phong: 1});
        var tempArr = [];
        billKey = billKey.toLowerCase();
        for(var i=0; i<bills.length; i++) {
            var billID = (bills[i]._id +'').toLowerCase();
            var ho_ten = bills[i].ma_tai_khoan.ho_ten.toLowerCase();
            if((billID.indexOf(billKey) != -1) || (ho_ten.indexOf(billKey) != -1)) {
                tempArr.push(bills[i]);
            }
        }
        bills = tempArr;
    }
    // Pagination
    var pageSelected = req.query.pageSelected * 1;
    var amountItemInPage = 6;
    var itemTotal = bills.length;
    var pageTotal = parseInt(itemTotal / amountItemInPage);
    if(itemTotal % amountItemInPage != 0) {
        pageTotal++;
    }
    var amountShowPage = pageTotal > 3 ? 3 : pageTotal;
    var itemFrom = (pageSelected * amountItemInPage) - amountItemInPage;
    var itemTo = (pageSelected * amountItemInPage) - 1;
    var billArr = [];
    for(var i=itemFrom; i<=itemTo; i++) {
        if(bills[i] == undefined) {
            break;
        }
        billArr.push(bills[i]);
    }
    var pageFrom, pageTo;
    if((pageSelected-3 > 1) && (pageSelected+3 < pageTotal)) {
        pageFrom = pageSelected - 3;
        pageTo = pageSelected + 3;
    }
    else {
        if(pageSelected-3 <= 1) {
            pageFrom = 1;
            pageTo = amountShowPage;
        }
        else if(pageSelected+3 >= pageTotal) {
            pageFrom = pageTotal-6 < 1 ? 1 : pageTotal-6;
            pageTo = pageTotal;
        }
    }
    var billData = '';
    for(i=0; i<billArr.length; i++) {
        billData += '<div class="col-lg-11 col-md-6 btn-icon-clipboard mx-auto deal">\
                        <div class="row">\
                            <div class="col-md-6">\
                                <h3 class="title">Thông tin hóa đơn</h3>\
                                <p class="info">Mã hóa đơn: '+ billArr[i]._id +'</p>\
                                <p class="info">Loại phòng: '+ billArr[i].ma_loai_phong.ten +'</p>\
                                <p class="info">Ngày đặt phòng: <em>'+ billArr[i].ngay_dat_phong +'</em></p>\
                            </div>\
                            <div class="col-md-6">\
                                <h3 class="title">Thông tin khách hàng</h3>\
                                <p class="info">Mã tài khoản: '+ billArr[i].ma_tai_khoan._id +'</p>\
                                <p class="info">Họ tên: '+ billArr[i].ma_tai_khoan.ho_ten +'</p>\
                                <p class="info">Số điện thoại: '+ billArr[i].ma_tai_khoan.so_dien_thoai +'</p>\
                            </div>\
                        </div>\
                        <div class="mt-md-3">\
                            <a href="./bill/'+ billArr[i]._id +'">\
                                <button class="btn btn-success">Xem chi tiết</button>\
                            </a>\
                        </div>\
                    </div>';
    }
    var paginateData = '';
    var classTemp = pageSelected == 1 ? 'disabled' : '';
    paginateData += '<li class="page-item '+ classTemp +'">\
                        <a class="page-link" aria-label="Previous" onclick="ChoosePaginateItem('+ 1 +')" title="1">\
                            <span aria-hidden="true"> &laquo;</span>\
                        </a>\
                    </li>';
    for(var i=pageFrom; i<=pageTo; i++) {
        if(i == pageSelected) {
            paginateData += '<li class="page-item active">\
                                <a class="page-link">'+ i +'</a>\
                            </li>';
        }
        else {
            paginateData += '<li class="page-item">\
                                <a class="page-link" style="cursor:pointer;" onclick="ChoosePaginateItem('+ i +')">'+ i +'</a>\
                            </li>';
        }
    }
    classTemp = pageTotal == pageSelected ? 'disabled' : '';
    paginateData += '<li class="page-item '+ classTemp +'">\
                        <a class="page-link" aria-label="Next" onclick="ChoosePaginateItem('+ pageTotal +')" title="'+ pageTotal +'">\
                            <span aria-hidden="true"> &raquo;</span>\
                        </a>\
                    </li>';
    res.send({
        billData: billData,
        paginateData: paginateData
    });
}