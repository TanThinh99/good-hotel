const jwt = require('jsonwebtoken');
const sha = require('js-sha256');
const paypal = require('paypal-rest-sdk');
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});

const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tanthinh199915@gmail.com',
        pass: 'al27Phte5'
    }
});

const taiKhoan = require('../models/tai_khoan.model');
const tinhThanh = require('../models/tinh_thanh_pho.model');
const quanHuyen = require('../models/quan_huyen.model');
const xaPhuong = require('../models/xa_phuong.model');
const khachSan = require('../models/khach_san.model');
const loaiPhong = require('../models/loai_phong.model');
const hinhAnh = require('../models/hinh_anh.model');
const hoaDon = require('../models/hoa_don.model');
const binhLuan = require('../models/binh_luan.model');
const tienNghiKS = require('../models/tien_nghi_khach_san.model');

module.exports.Index = async function(req, res) {
    var hotels, params = {}
    var key = req.query.key;
    var filter = req.query.filter;
    params.foundByKey = key;
    params.filterType = filter;
    if((key != undefined) && (filter != undefined)) {
        var filterType = filter.indexOf('Tang') != -1 ? 1 : -1;
        if(filter.indexOf('diem') == -1) {
            hotels = await khachSan.find({
                so_phong_con_lai: {$gt: 0},
                $or: [
                    {ten: {$regex: key, $options: 'i'}}, 
                    {dia_chi: {$regex: key, $options: 'i'}}
                ]}).sort({gia: filterType});
        }
        else {
            hotels = await khachSan.find({
                so_phong_con_lai: {$gt: 0},
                $or: [
                    {ten: {$regex: key, $options: 'i'}}, 
                    {dia_chi: {$regex: key, $options: 'i'}}
                ]}).sort({diem_trung_binh: filterType});
        }
    }
    else if((key != undefined) && (filter == undefined)) {
        hotels = await khachSan.find({
            so_phong_con_lai: {$gt: 0},
            $or: [
                {ten: {$regex: key, $options: 'i'}}, 
                {dia_chi: {$regex: key, $options: 'i'}}
            ]});
    }
    else if((key == undefined) && (filter != undefined)) {
        var filterType = filter.indexOf('Tang') != -1 ? 1 : -1;
        if(filter.indexOf('diem') == -1) {
            hotels = await khachSan.find({so_phong_con_lai: {$gt: 0}}).sort({gia: filterType});
        }
        else {
            hotels = await khachSan.find({so_phong_con_lai: {$gt: 0}}).sort({diem_trung_binh: filterType});
        }
    }
    else {
        hotels = await khachSan.find({so_phong_con_lai: {$gt: 0}});
    }
    // Get Image For Hotel
    for(var i=0; i<hotels.length; i++) {
        var firstImage = await hinhAnh.findOne({ma_khach_san: hotels[i].id});
        hotels[i].imageOfHotel = firstImage == null ? '' : firstImage.ten;
    }

    // Pagination
    var amountItemInPage = 8;
    var itemTotal = hotels.length;
    var pageTotal = parseInt(itemTotal / amountItemInPage);
    if(itemTotal % amountItemInPage != 0) {
        pageTotal++;
    }
    var amountShowPage = pageTotal > 7 ? 7 : pageTotal;
    params.pageTotal = pageTotal;
    params.amountShowPage = amountShowPage;
    var hotelArr = [];
    for(i=0; i<amountItemInPage; i++) {
        if(hotels[i] == undefined) {
            break;
        }
        hotelArr.push(hotels[i]);
    }
    params.hotels = hotelArr;
    var decode = req.session.decode;
    if(decode != undefined) {
        var accountID = decode.id;
        var account = await taiKhoan.findById(accountID).exec();
        params.username = account.ho_ten;
    }
    params.basketTotal = GetAmountAndPriceInBasket(req);
    res.render('user/index', params);
}

module.exports.ForgetPassword = async function(req, res) {
    var username = req.body.uid;
    var email = req.body.email;
    var account = await taiKhoan.findOne({username: username, email: email});
    if(account == undefined) {
        res.send({err: 'Tên đăng nhập hoặc email không đúng!'});
    }
    else {
        var content = {
            uid: username
        }
        var mailOptions = {
            from: 'tanthinh199915@gmail.com',
            to: email,
            subject: 'Good Hotel. Có yêu cầu đổi mật khẩu từ bạn',
            html: ''
        }
        try {
            var token = jwt.sign(content, process.env.PASS_EMAIL_SYSTEM, {expiresIn: 600});
            mailOptions.html = '<p>Thân chào bạn</p>\
                                <p>Bạn đã có yêu cầu đổi mật khẩu mới, nên chúng tôi gửi email này đến bạn.</p>\
                                <p>Dưới đây là <b>chuỗi mã hóa</b>. Thời hạn của chuỗi này là 10 phút.</p>\
                                <p style="border-top:3px solid lime; border-bottom:3px solid lime; padding: 12px;">\
                                    '+ token +'\
                                </p>\
                                <p>Thân chào bạn</p>\
                                <p><b>Good Hotel</b></p>';
            transporter.sendMail(mailOptions, function(err, info) {
                if(err) {
                    console.log(err);
                    res.send({err: 'Hệ thống gửi email có lỗi. Quý khách vui lòng thử lại sau!'});
                }
                else {
                    res.send({err: ''});
                }
            });
        } catch (error) {
            console.log(err);
        }
    }
}

module.exports.ConfirmNewPassword = async function(req, res) {
    var token = req.body.token;
    var password = req.body.password;
    try {
        var decode = jwt.verify(token, process.env.PASS_EMAIL_SYSTEM);
        var username = decode.uid;
        var account = await taiKhoan.findOne({username: username});
        account.password = sha(password);
        account.save();
        res.send({err: ''});
    } catch (error) {
        console.log(error);
        res.send({err: 'Chuỗi mã hóa đã hết hạn hoặc không hợp lệ'});
    }
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
    var bills = await hoaDon.find({ma_tai_khoan: decode.id})
        .populate("ma_loai_phong")
        .populate({
            path: 'ma_loai_phong',
            populate: {path: 'ma_khach_san'}
        })
        .sort({"da_thanh_toan": 1, "ngay_dat_phong": -1});
    // Pagination
    var amountItemInPage = 3;
    var itemTotal = bills.length;
    var pageTotal = parseInt(itemTotal / amountItemInPage);
    if(itemTotal % amountItemInPage != 0) {
        pageTotal++;
    }
    var amountShowPage = pageTotal > 7 ? 7 : pageTotal;
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
    params.basketTotal = GetAmountAndPriceInBasket(req);
    res.render('user/account', params);
}

module.exports.HotelDetail = async function(req, res) {
    var hotelID = req.params.hotelID;
    var hotel = await khachSan.findById(hotelID);
    var params = {
        hotel: hotel
    }
    var hotelImages = await hinhAnh.find({ma_khach_san: hotelID});
    params.hotelImages = hotelImages;
    params.amountHotelImages = hotelImages.length;

    var hotelConven = await tienNghiKS.find({ma_khach_san: hotelID}).populate('ma_tien_nghi');
    params.hotelConvenient = hotelConven;

    var decode = req.session.decode;
    if(decode != undefined) {
        var accountID = decode.id;
        var account = await taiKhoan.findById(accountID);
        params.username = account.ho_ten;
        params.avatar = account.avatar;
        params.userID = account._id;
    }
    var roomTypes = await loaiPhong.find({ma_khach_san: hotelID}).sort({gia: 1});
    params.roomTypes = roomTypes;
    for(i=0; i<roomTypes.length; i++) {
        var imagesRoomType = await hinhAnh.find({ma_loai_phong: roomTypes[i]._id});
        params.roomTypes[i].imagesRoomType = imagesRoomType;
        params.roomTypes[i].amountImagesRoomType = imagesRoomType.length;
    }  
    var comments = await binhLuan.find({ma_khach_san: hotelID})
        .populate('ma_khach_san')
        .populate('ma_tai_khoan')
        .sort({thoi_gian: -1});
    params.amountComment = comments.length;
    // Pagination
    var amountItemInPage = 6;
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
    params.basketTotal = GetAmountAndPriceInBasket(req);
    res.render('user/hotelDetail', params);
}

    // Đổi định dạng chuỗi tiền: 1000000 => 1.000.000
function ShowMoney(money) {
    money = money +'';
    if(money.length <= 3) {
        return money;
    }   
    else {
        var newMoney = '';
        while(money.length > 3) {
            var temp = money.substring(money.length-3);
            newMoney = '.'+ temp + newMoney;
            money = money.substring(0, money.length-3);
        }
        newMoney = money + newMoney;
        return newMoney;
    }
}

    // Lấy tổng số lượng và giá trong giỏ hàng
function GetAmountAndPriceInBasket(req) {
    var basket = req.session.basket;
    basket = basket == undefined ? [] : basket;
    var price = 0;
    var result = {
        amount: basket.length
    }
    for(var i=0; i<basket.length; i++) {
        var total = basket[i].roomType.gia * basket[i].amountRoom * basket[i].amountDate;
        price += total;
    }
    result.price = ShowMoney(price);
    return result;
}

module.exports.Basket = async function(req, res) {
    var basket = req.session.basket;
    if(basket == undefined) {
        basket = [];
    }
    var params = {
        basket: basket
    }
    // Get convenient of this hotel
    for(var i=0; i<basket.length; i++) {
        var hotelID = basket[i].roomType.ma_khach_san;
        var convens = await tienNghiKS.find({ma_khach_san: hotelID}).populate('ma_tien_nghi');
        basket[i].convens = convens;
    }

    var decode = req.session.decode;
    if(decode != undefined) {
        var account = await taiKhoan.findById(decode.id);
        params.account = account;
        params.username = account.ho_ten;
    }
    params.token = req.session.token;
    params.basketTotal = GetAmountAndPriceInBasket(req);
    res.render('user/basket', params);
}

module.exports.Checkout = async function(req, res) {
    var params = {
        basketTotal: GetAmountAndPriceInBasket(req),
        token: req.session.token
    }
    var decode = req.session.decode;
    if(decode != undefined) {
        var account = await taiKhoan.findById(decode.id);
        params.username = account.ho_ten;
    }
    res.render('user/checkout', params);
}

module.exports.OnlinePayment = async function(req, res) {
    var basket = req.session.basket;
    var basketTemp = [];
    var basketTemp = basket == undefined ? [] : basketTemp.concat(basket);
    var errorStr = '';
    while(basketTemp.length != 0) {
        var roomTypeID = basketTemp[0].roomType._id;
        var roomType = await loaiPhong.findById(roomTypeID);
        var hotelName = basketTemp[0].hotelName;
        var amountRoom = roomType.so_luong_con_lai;
        for(var i=0; i<basketTemp.length; i++) {
            if(basketTemp[i].roomType._id == roomTypeID) {
                amountRoom -= basketTemp[i].amountRoom;
                basketTemp.splice(i, 1);
                i--;
            }
        }
        if(amountRoom < 0) {
            errorStr += 'Số phòng loại '+ roomType.ten +' tại khách sạn '+ hotelName +' chỉ còn '+ roomType.so_luong_con_lai +' phòng. ';
        }
    }
    if(errorStr != '') {
        // Update roomType for basket
        var basket = req.session.basket;
        for(var i=0; i<basket.length; i++) {
            var roomTypeID = basket[i].roomType._id;
            var roomType = await loaiPhong.findById(roomTypeID);
            basket[i].roomType = roomType;
        }

        errorStr += ' Quý khách vui lòng điều chỉnh lại các đơn phòng!';
        var announce = '<script>\
                            alert("'+ errorStr +'");\
                            window.location.href = "http://localhost:8000/basket";\
                        </script>';
        res.send(announce);
    }
    else {
        basket = basket == undefined ? [] : basket;
        var itemsArr = [];
        var usdPrice = 23000;
        var basketTotalPrice = 0;
            // Items in basket
        for(var i=0; i<basket.length; i++) {
            var price = (basket[i].amountRoom * basket[i].amountDate * basket[i].roomType.gia) / usdPrice;
            basketTotalPrice += price;
            var priceArr = (price+'').split('.');
            if(priceArr.length == 1) {
                price = priceArr[0] +'00';
            }
            else {
                var duoi = priceArr[1].length >= 3 ? priceArr[1].substring(0, 2) : priceArr[1];
                duoi = duoi.length == 1 ? duoi+'0' : duoi;
                price = priceArr[0] +'.'+ duoi;
            }
            
            var obj = {
                "name": "phòng "+ basket[i].roomType.ten,
                "sku": "Khách sạn "+ basket[i].hotelName,
                "price": price,
                "currency": "USD",
                "quantity": basket[i].amountRoom
            }
            itemsArr.push(obj);
        }
            // Udate format for basketTotalPrice
        var priceArr = (basketTotalPrice+'').split('.');
        if(priceArr.length == 1) {
            basketTotalPrice = priceArr[0] +'00';
        }
        else {
            var duoi = priceArr[1].length >= 3 ? priceArr[1].substring(0, 2) : priceArr[1];
            duoi = duoi.length == 1 ? duoi+'0' : duoi;
            basketTotalPrice = priceArr[0] +'.'+ duoi;
        }
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:8000/successPayment",
                "cancel_url": "http://localhost:8000/checkout"
            },
            "transactions": [{
                "item_list": {
                    "items": itemsArr
                    // [{
                    //     "name": "Ao khoac",
                    //     "sku": "Khách sạn ABC",
                    //     "price": "20.00",
                    //     "currency": "USD",
                    //     "quantity": 2
                    // }]
                },
                "amount": {
                    "currency": "USD",
                    "total": basketTotalPrice
                },
                "description": "Các đơn đặt phòng"
            }]
        }
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log(error);
                var str = '<script>\
                                alert("Thanh toán trực tuyến gặp vấn đề, quý khách vui lòng thử lại sau!");\
                                window.location.href = "/checkout";\
                            </script>';
                res.send(str);
            } 
            else {
                for(var i=0; i<payment.links.length; i++) {
                    if(payment.links[i].rel == 'approval_url') {
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });
    }
}

function FormatNumberInDate(number) {
    if(number < 10) {
        return '0'+ number;
    }
    return number;
}

module.exports.SuccessPayment = function(req, res) {
    var payerID = req.query.PayerID;
    var paymentID = req.query.paymentId;
    var basket = req.session.basket;
    basket = basket == undefined ? [] : basket;
    var usdPrice = 23000;
    var basketTotalPrice = 0;
    for(var i=0; i<basket.length; i++) {
        var price = (basket[i].amountRoom * basket[i].amountDate * basket[i].roomType.gia) / usdPrice;
        basketTotalPrice += price;
    }
    var priceArr = (basketTotalPrice+'').split('.');
    if(priceArr.length == 1) {
        basketTotalPrice = priceArr[0] +'00';
    }
    else {
        var duoi = priceArr[1].length >= 3 ? priceArr[1].substring(0, 2) : priceArr[1];
        duoi = duoi.length == 1 ? duoi+'0' : duoi;
        basketTotalPrice = priceArr[0] +'.'+ duoi;
    }
    var execute_payment_json = {
        "payer_id": payerID,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": basketTotalPrice
            },
        }]
    }
    paypal.payment.execute(paymentID, execute_payment_json, async function (error, payment) {
        if (error) {
            console.log(error);
            var str = '<script>\
                            alert("Thanh toán không thành công, quý khách vui lòng thử lại!");\
                            window.location.href = "/checkout";\
                        </script>';
            res.send(str);
        }
        else {
                // Tạo đơn đặt phòng đã thanh toán xong
            var date = new Date();
            var month = FormatNumberInDate(date.getMonth() + 1);
            var day = FormatNumberInDate(date.getDate());
            var hour = FormatNumberInDate(date.getHours());
            var minute = FormatNumberInDate(date.getMinutes());
            var second = FormatNumberInDate(date.getSeconds());    
            var time = date.getFullYear() +"-"+ month +"-"+ day +" "+ hour +":"+ minute +":"+ second;
            
            var decode = req.session.decode;
            var basket = req.session.basket;
            basket = basket == undefined ? [] : basket;
            var objArr = [];
            for(i=0; i<basket.length; i++) {
                var obj = {
                    ngay_dat_phong: time,
                    ngay_nhan_phong: basket[i].fromDate,
                    ngay_tra_phong: basket[i].toDate,
                    gia_dat_phong: basket[i].roomType.gia,
                    so_luong_phong: basket[i].amountRoom,
                    da_thanh_toan: true,
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
            await hoaDon.insertMany(objArr);
                // Xóa các đơn đặt phòng trong giỏ hàng
            req.session.basket = [];
            var str = '<script>\
                            alert("Thanh toán thành công, chúc quý khách có những trải nghiệm vui vẻ ^^");\
                            window.location.href = "/";\
                        </script>';
            res.send(str);
        }
    });
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
    
    var firstDistID = districts[0]._id;
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

    res.send({
        distStr: str,
        firstDistID: firstDistID
    });
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
    var itemID = 1;
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
    amountDate = amountDate == 0 ? 1 : amountDate;
    var obj = {
        itemID: itemID,
        hotelName: hotel.ten,
        roomType: roomType,
        amountRoom: req.body.amountRoom *1,
        fromDate: fromDate,
        toDate: toDate,
        amountDate: amountDate
    }
    basket.push(obj);
    req.session.basket = basket;
    res.send({
        basketInfo: GetAmountAndPriceInBasket(req)
    });
}

module.exports.UpdateInBasket = async function(req, res) {
    var basket = req.session.basket;
    var itemID = req.body.itemID;
    var fromDate = req.body.fromDate;
    var toDate = req.body.toDate;
    for(i=0; i<basket.length; i++) {
        if(basket[i].itemID == itemID) {
            // Update basket at this room type
            basket[i].amountRoom = req.body.amountRoom *1;
            basket[i].fromDate = fromDate;
            basket[i].toDate = toDate;
            basket[i].amountDate = req.body.amountDate;
            break;
        }
    }
    req.session.basket = basket;
    res.send({
        basketInfo: GetAmountAndPriceInBasket(req)
    });
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
    res.send({
        basketInfo: GetAmountAndPriceInBasket(req)
    });
}

    // Function to Bills in account's information
module.exports.GetBillDetail = async function(req, res) {
    var billID = req.params.billID;
    var bill = await hoaDon.findById(billID)
        .populate('ma_loai_phong')
        .populate({
            path: 'ma_loai_phong',
            populate: {path: 'ma_khach_san'}
        });
    res.json(bill);
}

module.exports.PayBill = async function(req, res) {
    var billID = req.query.billID;
    var bill = await hoaDon.findById(billID);
    var roomType = await loaiPhong.findById(bill.ma_loai_phong);
    var hotel = await khachSan.findById(roomType.ma_khach_san);
    var usdPrice = 23000;
    
    var receiveRoomDate = new Date(bill.ngay_nhan_phong);
    var returnRoomDate = new Date(bill.ngay_tra_phong);
    var amountDate = (returnRoomDate.getTime() - receiveRoomDate.getTime()) / (24*60*60*1000);
    amountDate = amountDate == 0 ? 1 : amountDate;
    var price = (bill.so_luong_phong * bill.gia_dat_phong * amountDate) / usdPrice;
    
    var priceArr = (price+'').split('.');
    if(priceArr.length == 1) {
        price = priceArr[0] +'00';
    }
    else {
        var duoi = priceArr[1].length >= 3 ? priceArr[1].substring(0, 2) : priceArr[1];
        duoi = duoi.length == 1 ? duoi+'0' : duoi;
        price = priceArr[0] +'.'+ duoi;
    }
    var obj = {
        "name": "phòng "+ roomType.ten,
        "sku": "Khách sạn "+ hotel.ten,
        "price": price,
        "currency": "USD",
        "quantity": bill.so_luong_phong
    }
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:8000/successPaymentOfBill?billID="+ billID,
            "cancel_url": "http://localhost:8000/account"
        },
        "transactions": [{
            "item_list": {
                "items": [obj]
            },
            "amount": {
                "currency": "USD",
                "total": price
            },
            "description": "Hóa đơn đặt phòng"
        }]
    }
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error);
            var str = '<script>\
                            alert("Thanh toán trực tuyến gặp vấn đề, quý khách vui lòng thử lại sau!");\
                            window.location.href = "http://localhost:8000/account";\
                        </script>';
            res.send(str);
        } else {
            for(var i=0; i<payment.links.length; i++) {
                if(payment.links[i].rel == 'approval_url') {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
}

module.exports.SuccessPaymentOfBill = async function(req, res) {
    var payerID = req.query.PayerID;
    var paymentID = req.query.paymentId;
    var billID = req.query.billID;
    var bill = await hoaDon.findById(billID);
    var usdPrice = 23000;
    
    var receiveRoomDate = new Date(bill.ngay_nhan_phong);
    var returnRoomDate = new Date(bill.ngay_tra_phong);
    var amountDate = (returnRoomDate.getTime() - receiveRoomDate.getTime()) / (24*60*60*1000);
    amountDate = amountDate == 0 ? 1 : amountDate;
    var price = (bill.so_luong_phong * bill.gia_dat_phong * amountDate) / usdPrice;
    
    var priceArr = (price+'').split('.');
    if(priceArr.length == 1) {
        price = priceArr[0] +'00';
    }
    else {
        var duoi = priceArr[1].length >= 3 ? priceArr[1].substring(0, 2) : priceArr[1];
        duoi = duoi.length == 1 ? duoi+'0' : duoi;
        price = priceArr[0] +'.'+ duoi;
    }
    var execute_payment_json = {
        "payer_id": payerID,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": price
            },
        }]
    }
    paypal.payment.execute(paymentID, execute_payment_json, async function (error, payment) {
        if (error) {
            console.log(error);
            var str = '<script>\
                            alert("Thanh toán không thành công, quý khách vui lòng thử lại!");\
                            window.location.href = "http://localhost:8000/account";\
                        </script>';
            res.send(str);
        }
        else {
            var bill = await hoaDon.findById(billID);
            bill.da_thanh_toan = true;
            bill.save();

            // reduce amountRoom in roomType and hotel
            var roomType = await loaiPhong.findById(bill.ma_loai_phong);
            roomType.so_luong_con_lai = roomType.so_luong_con_lai - bill.so_luong_phong;
            roomType.save();
            var hotel = await khachSan.findById(roomType.ma_khach_san);
            hotel.so_phong_con_lai = hotel.so_phong_con_lai - bill.so_luong_phong;
            hotel.save();
            
            var str = '<script>\
                            alert("Thanh toán thành công, chúc quý khách có những trải nghiệm vui vẻ ^^");\
                            window.location.href = "http://localhost:8000/account";\
                        </script>';
            res.send(str);
        }
    });
}

module.exports.DestroyBill = async function(req, res) {
    var billID = req.body.billID;
    var bill = await hoaDon.findByIdAndRemove(billID);

    // increase amountRoom in roomType and hotel
    var roomType = await loaiPhong.findById(bill.ma_loai_phong);
    roomType.so_luong_con_lai = roomType.so_luong_con_lai + bill.so_luong_phong;
    roomType.save();
    var hotel = await khachSan.findById(roomType.ma_khach_san);
    hotel.so_phong_con_lai = hotel.so_phong_con_lai + bill.so_luong_phong;
    hotel.save();
    res.sendStatus(200);
}

    // Pagination
module.exports.GetHotelForPagination = async function(req, res) {
    var key = req.query.key;
    if(req.query.filter != '') {
        var filter = req.query.filter;
        var filterType = (filter.indexOf('Tang') != -1) ? 1 : -1;
        var hotels;
        if(filter.indexOf('diem') != -1) {
            hotels = await khachSan.find({
                so_phong_con_lai: {$gt: 0},
                $or: [
                    {ten: {$regex: key, $options: 'i'}}, 
                    {dia_chi: {$regex: key, $options: 'i'}}
                ]}).sort({diem_trung_binh: filterType});
        }
        else {
            hotels = await khachSan.find({
                so_phong_con_lai: {$gt: 0},
                $or: [
                    {ten: {$regex: key, $options: 'i'}}, 
                    {dia_chi: {$regex: key, $options: 'i'}}
                ]}).sort({gia: filterType});
        }
    }
    else {
        hotels = await khachSan.find({
            so_phong_con_lai: {$gt: 0},
            $or: [
                {ten: {$regex: key, $options: 'i'}}, 
                {dia_chi: {$regex: key, $options: 'i'}}
            ]});
    }
    // Get Image For Hotel
    for(var i=0; i<hotels.length; i++) {
        var firstImage = await hinhAnh.findOne({ma_khach_san: hotels[i]._id});
        hotels[i].imageOfHotel = firstImage == null ? '' : firstImage.ten;
    }

    // Pagination
    var pageSelected = req.query.pageSelected * 1;
    var amountItemInPage = 8;
    var itemTotal = hotels.length;
    var pageTotal = parseInt(itemTotal / amountItemInPage);
    if(itemTotal % amountItemInPage != 0) {
        pageTotal++;
    }
    var amountShowPage = pageTotal > 7 ? 7 : pageTotal;
    var itemFrom = (pageSelected * amountItemInPage) - amountItemInPage;
    var itemTo = (pageSelected * amountItemInPage) - 1;
    var hotelArr = [];
    for(var i=itemFrom; i<=itemTo; i++) {
        if(hotels[i] == undefined) {
            break;
        }
        hotelArr.push(hotels[i]);
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
    var hotelData = '';
    for(i=0; i<hotelArr.length; i++) {
        hotelData += '<div class="col-lg-6 col-md-6">\
                            <a class="latest-product__item hotel-item" href="/detail/'+ hotelArr[i]._id +'">\
                                <div class="latest-product__item__pic">\
                                    <img src="/uploads/'+ hotelArr[i].imageOfHotel +'" alt="">\
                                </div>\
                                <div class="latest-product__item__text">\
                                    <h5 class="hotelName">'+ hotelArr[i].ten +'</h5>\
                                    <p>\
                                        <span class="score">'+ hotelArr[i].diem_trung_binh +'</span>\
                                        <span class="level">Rất tốt</span>\
                                        ('+ hotelArr[i].so_luong_binh_luan +' đánh giá)\
                                    </p>\
                                    <p>\
                                        <b>Giá:</b>\
                                        <span class="showMoney ml-2 mr-1">'+ ShowMoney(hotelArr[i].gia) +'</span>\
                                        <b style="color: red; font-size: 18px;">VND</b>\
                                    </p>\
                                    <p>\
                                        <b>Địa chỉ: </b>'+ hotelArr[i].dia_chi +'</b>\
                                    </p>\
                                </div>\
                            </a>\
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
        hotelData: hotelData,
        paginateData: paginateData
    });
}

module.exports.GetCommentHotelForPagination = async function(req, res) {
    var hotelID = req.query.hotelID;
    var comments = await binhLuan.find({ma_khach_san: hotelID})
        .populate('ma_khach_san')
        .populate('ma_tai_khoan')
        .sort({thoi_gian: -1});

    // Pagination
    var pageSelected = req.query.pageSelected * 1;
    var amountItemInPage = 6;
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
    var decode = req.session.decode;
    for(i=0; i<commentArr.length; i++) {
        var commentFunc = '';
        if(decode != undefined) {
            if(decode.id == commentArr[i].ma_tai_khoan._id) {
                commentFunc = '<span class="ml-3">\
                                    <i class="fa fa-pencil" aria-hidden="true" title="Chỉnh sửa" style="cursor:pointer;" data-toggle="modal" data-target="#commentModal" onclick="OpenUpdateComment(\''+ commentArr[i]._id +'\')"></i>\
                                </span>\
                                <span class="ml-1"><i class="fa fa-trash-o" aria-hidden="true" title="Xóa" style="cursor:pointer;" onclick="DeleteComment(\''+ commentArr[i]._id +'\')"></i></span>';
            }
        }
        var reviewReply = '';
        if(commentArr[i].noi_dung_phan_hoi != '') {
            reviewReply = '<div class="review-reply">\
                                <div class="desc manager">\
                                    <h4>\
                                        <span class="reply-title text-left">\
                                            <i class="fa fa-commenting-o aria-hidden="true"></i>\
                                            Phản hồi từ Quản lý khách sạn\
                                        </span>\
                                        <span class="reply-time">'+ commentArr[i].thoi_gian_phan_hoi +'</span>\
                                    </h4>\
                                    <p class="content">'+ commentArr[i].noi_dung_phan_hoi +'</p>\
                                </div>\
                            </div>';
        }
        commentData += '<div class="col-12 review" id="review'+ commentArr[i]._id +'">\
                            <img src="/uploads/'+ commentArr[i].ma_tai_khoan.avatar +'" style="width:80px; border-radius:50%; float:left;">\
                            <div class="desc">\
                                <h4>\
                                    <span class="text-left review-name">'+ commentArr[i].ma_tai_khoan.ho_ten +'</span>\
                                    <span class="text-right review-time" id="time'+ commentArr[i]._id +'">'+ commentArr[i].thoi_gian +'</span>\
                                </h4>\
                                <p class="star">\
                                    <span id="score'+ commentArr[i]._id +'">'+ commentArr[i].diem +'.0</span>'+ commentFunc +'\
                                </p>\
                                <div>\
                                    <p>\
                                        <b class="good">Tốt: </b>\
                                        <span id="goodReview'+ commentArr[i]._id +'">'+ commentArr[i].noi_dung_tot +'</span>\
                                    </p>\
                                    <p>\
                                        <b class="bad">Góp ý: </b>\
                                        <span id="badReview'+ commentArr[i]._id +'">'+ commentArr[i].noi_dung_xau +'</span>\
                                    </p>\
                                </div>\
                            </div>'+ reviewReply +'\
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
    if(decode == undefined) {
        res.redirect('/');
    }
    var bills = await hoaDon.find({ma_tai_khoan: decode.id})
        .populate("ma_loai_phong")
        .populate({
            path: 'ma_loai_phong',
            populate: {path: 'ma_khach_san'}
        })
        .sort({"da_thanh_toan": 1, "ngay_dat_phong": -1});
    
    // Pagination
    var pageSelected = req.query.pageSelected * 1;
    var amountItemInPage = 3;
    var itemTotal = bills.length;
    var pageTotal = parseInt(itemTotal / amountItemInPage);
    if(itemTotal % amountItemInPage != 0) {
        pageTotal++;
    }
    var amountShowPage = pageTotal > 7 ? 7 : pageTotal;
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
        var funcStr = '';
        if(billArr[i].da_thanh_toan == false) {
            funcStr = '<button class="btn btn-success mr-2" onclick="PayBill(\''+ billArr[i]._id +'\')">\
                            <i class="fa fa-credit-card mr-1" aria-hidden="true"></i>Thanh toán\
                        </button>\
                        <button class="btn btn-danger" onclick="DestroyBill(\''+ billArr[i]._id +'\')">\
                            <i class="fa fa-ban mr-1" aria-hidden="true"></i>Hủy đặt phòng\
                        </button>';
        }
        billData += '<div class="col-lg-11 col-md-6 mx-auto bill" id="bill'+ billArr[i]._id +'">\
                        <div class="row">\
                            <div class="col-md-7">\
                                <h4 class="title">Thông tin khách sạn</h4>\
                                <p>Tên: '+ billArr[i].ma_loai_phong.ma_khach_san.ten +'</p>\
                                <p>Số điện thoại: '+ billArr[i].ma_loai_phong.ma_khach_san.so_dien_thoai +'</p>\
                                <p>Địa chỉ: '+ billArr[i].ma_loai_phong.ma_khach_san.dia_chi +'</p>\
                            </div>\
                            <div class="col-md-5">\
                                <h4 class="title">Thông tin loại phòng</h4>\
                                <p>Loại phòng: '+ billArr[i].ma_loai_phong.ten +'</p>\
                                <p>Ngày đặt phòng: <em>'+ billArr[i].ngay_dat_phong +'</em></p>\
                                <p>Ngày nhận phòng: <em>'+ billArr[i].ngay_nhan_phong +'</em></p>\
                            </div>\
                        </div>\
                        <div class="mt-2">\
                            <button class="btn btn-info mr-2" onclick="GetBillDetail(\''+ billArr[i]._id +'\')">\
                                <i class="fa fa-info-circle mr-1" aria-hidden="true"></i>Xem chi tiết\
                            </button>'+ funcStr +'\
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