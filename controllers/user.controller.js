var axios = require('axios');
const taiKhoan = require('../models/tai_khoan.model');
const tinhThanh = require('../models/tinh_thanh_pho.model');
const quanHuyen = require('../models/quan_huyen.model');
const xaPhuong = require('../models/xa_phuong.model');
const khachSan = require('../models/khach_san.model');
const loaiPhong = require('../models/loai_phong.model');
const hinhAnh = require('../models/hinh_anh.model');
const hoaDon = require('../models/hoa_don.model');

module.exports.Index = async function(req, res) {
    var hotels = await axios({
        method: 'GET',
        url: 'http://localhost:8000/api/khach_san'
    });
    var params = {
        hotels: hotels.data
    };

    var decode = req.session.decode;
    if(decode != undefined) {
        var accountID = decode.id;
        var account = await taiKhoan.findById(accountID).exec();
        params.username = account.ho_ten;
    }
    res.render('user/index', params);
}

module.exports.Account = async function(req, res) {
    var params = {};
    var decode = req.session.decode;
    var account = await taiKhoan.findById(decode.id).exec();
    params.username = account.ho_ten;
    params.account = account;

    var cities = await tinhThanh.find();
    params.cities = cities;
    
    // token
    params.token = req.session.token;
    params.csrfToken = req.session.csrfToken;

    if(account.maxp != '') {
        // Nếu đã có địa chỉ
        var wardOfUser = await xaPhuong.findOne({_id: account.maxp});
        var distOfUser = await quanHuyen.findOne({_id: wardOfUser.maqh});
        var cityOfUser = await tinhThanh.findOne({_id: distOfUser.matp});
        var districts = await quanHuyen.find({matp: cityOfUser._id});
        var wards = await xaPhuong.find({maqh: distOfUser._id});
        params.wardOfUser = wardOfUser;
        params.distOfUser = distOfUser;
        params.cityOfUser = cityOfUser;
        params.districts = districts;  
        params.wards = wards;

        // street name
        var address = account.dia_chi;
        var addressArr = address.split(',');
        var streetName = addressArr.slice(0, addressArr.length-3).join();
        params.streetName = streetName;    
    }
    // Account's bills
    var bills = await hoaDon.find({ma_tai_khoan: decode.id}).populate("ma_loai_phong").sort({"da_thanh_toan": 1, "ngay_dat_phong": -1});
    params.bills = bills;
    res.render('user/account', params);
}

module.exports.HotelDetail = async function(req, res) {
    var hotelID = req.params.hotelID;
    var hotel = await khachSan.findById(hotelID);
    var params = {
        hotel: hotel
    }
    var roomTypes = await loaiPhong.find({ma_khach_san: hotelID});
    params.roomTypes = roomTypes;
    for(i=0; i<roomTypes.length; i++) {
        var imagesRoomType = await hinhAnh.find({ma_loai_phong: roomTypes[i]._id});
        params.roomTypes[i].imagesRoomType = imagesRoomType;
        params.roomTypes[i].amountImagesRoomType = imagesRoomType.length;
    }    
    res.render('user/hotelDetail', params);
}

module.exports.Basket = async function(req, res) {
    var basket = req.session.basket;
    if(basket == undefined) {
        basket = [];
    }
    var params = {
        basket: basket
    }
    var decode = req.session.decode;
    if(decode != undefined) {
        var account = await taiKhoan.findById(decode.id);
        params.account = account;
        params.username = account.ho_ten;
    }
    params.token = req.session.token;
    res.render('user/basket', params);
}

module.exports.Logout = function(req, res) {
    req.session.token = undefined;
    req.session.decode = undefined;
    res.redirect('/');
}

//============= AJAX ===============
    // Choose address
module.exports.District_of_city = async function(req, res) {
    var cityID = req.params.cityID;
    var districts = await quanHuyen.find({matp: cityID});
    var str = "<div class='btn btn-light selectBtn' onclick=\"ToggleSelect(\'selectDistContent\')\">\
                    <div class='row'>\
                        <div class='col-10' id='distMain'>"+ districts[0].ten +"</div>\
                        <div class='col-2 text-right'>\
                            <i class='fa fa-chevron-down'></i>\
                        </div>\
                    </div>\
                </div>\
                <div id='selectDistContent' class='row mx-auto optionList'>";
        
    for(var i=0; i<districts.length; i++) {
        if(i == 0) {
            str += "<div class='col-5 option active' id='dist"+ districts[i]._id +"' onclick='ChooseDist(\""+ districts[i]._id +"\", \""+ districts[i].ten +"\")'>"+ districts[i].ten +"</div>";
        }
        else {
            str += "<div class='col-5 option' id='dist"+ districts[i]._id +"' onclick='ChooseDist(\""+ districts[i]._id +"\", \""+ districts[i].ten +"\")'>"+ districts[i].ten +"</div>";   
        }
    } 
    str += "<input type='hidden' id='distChosen' value='"+ districts[0]._id +"'>\
        </div>";

    res.send(str);
}

module.exports.Wards_of_district = async function(req, res) {
    var distID = req.params.distID;
    var wards = await xaPhuong.find({maqh: distID});
    var str = "<div class='btn btn-light selectBtn' onclick=\"ToggleSelect(\'selectWardContent\')\">\
                    <div class='row'>\
                        <div class='col-10' id='wardMain'>"+ wards[0].ten +"</div>\
                        <div class='col-2 text-right'>\
                            <i class='fa fa-chevron-down'></i>\
                        </div>\
                    </div>\
                </div>\
                <div id='selectWardContent' class='row mx-auto optionList'>";
        
    for(var i=0; i<wards.length; i++) {
        if(i == 0) {
            str += "<div class='col-5 option active' id='ward"+ wards[i]._id +"' onclick='ChooseWard(\""+ wards[i]._id +"\", \""+ wards[i].ten +"\")'>"+ wards[i].ten +"</div>";
        }
        else {
            str += "<div class='col-5 option' id='ward"+ wards[i]._id +"' onclick='ChooseWard(\""+ wards[i]._id +"\", \""+ wards[i].ten +"\")'>"+ wards[i].ten +"</div>";   
        }
    } 
    str += "<input type='hidden' id='wardChosen' value='"+ wards[0]._id +"'>\
        </div>";

    res.send(str);
}

    // Functions to Basket
module.exports.AddToBasket = async function(req, res) {
    var basket = req.session.basket;
    var itemID = '1';
    if(basket == undefined) {
        basket = [];
    }
    else {
        if(basket.length != 0) {
            itemID = basket[basket.length - 1].itemID*1 + 1;
        }        
    }
    var roomTypeID = req.body.roomTypeID;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    var roomType = await loaiPhong.findById(roomTypeID);
    var hotel = await khachSan.findById(roomType.ma_khach_san);
    var d1 = new Date(fromDate);
    var d2 = new Date(toDate);
    var amountDate = (d2-d1)/(24 * 3600 * 1000);
    
    var obj = {
        itemID: itemID,
        hotelName: hotel.ten,
        roomTypeID: roomTypeID,
        roomTypeName: roomType.ten,
        roomTypePrice: roomType.gia,
        amountRoom: req.body.amountRoom,
        fromDate: fromDate,
        toDate: toDate,
        amountDate: amountDate
    }
    basket.push(obj);
    req.session.basket = basket;
    res.sendStatus(200);
}

module.exports.UpdateInBasket = async function(req, res) {
    var basket = req.session.basket;
    var itemID = req.body.itemID;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    for(i=0; i<basket.length; i++) {
        if(basket[i].itemID == itemID) {
            // Update basket at this room type
            basket[i].amountRoom = req.body.amountRoom;
            basket[i].fromDate = fromDate;
            basket[i].toDate = toDate;
            basket[i].amountDate = req.body.amountDate;
            break;
        }
    }
    req.session.basket = basket;
    res.sendStatus(200);
}

module.exports.DeleteInBasket = async function(req, res) {
    var basket = req.session.basket;
    var itemID = req.body.itemID;
    for(i=0; i<basket.length; i++) {
        if(basket[i].itemID == itemID) {
            basket.splice(i, 1);
            break;
        }
    }
    req.session.basket = basket;
    res.sendStatus(200);
}

    // Function to Bills in account's information
module.exports.GetBillDetail = async function(req, res) {
    var billID = req.params.billID;
    var bill = await hoaDon.findById(billID).populate('ma_loai_phong');
    res.json(bill);
}

module.exports.PayBill = async function(req, res) {
    var billID = req.body.billID;
    var bill = await hoaDon.findById(billID);
    bill.da_thanh_toan = true;
    bill.save();
    res.sendStatus(200);
}

module.exports.DestroyBill = async function(req, res) {
    var billID = req.body.billID;
    var bill = await hoaDon.findByIdAndRemove(billID);
    res.sendStatus(200);
}