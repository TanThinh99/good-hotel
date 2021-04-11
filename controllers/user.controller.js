const taiKhoan = require('../models/tai_khoan.model');
const tinhThanh = require('../models/tinh_thanh_pho.model');
const quanHuyen = require('../models/quan_huyen.model');
const xaPhuong = require('../models/xa_phuong.model');
const khachSan = require('../models/khach_san.model');
const loaiPhong = require('../models/loai_phong.model');
const hinhAnh = require('../models/hinh_anh.model');
const hoaDon = require('../models/hoa_don.model');
const binhLuan = require('../models/binh_luan.model');

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
                $or: [
                    {ten: {$regex: key, $options: 'i'}}, 
                    {dia_chi: {$regex: key, $options: 'i'}}
                ]}).sort({gia: filterType});
        }
        else {
            hotels = await khachSan.find({
                $or: [
                    {ten: {$regex: key, $options: 'i'}}, 
                    {dia_chi: {$regex: key, $options: 'i'}}
                ]}).sort({diem_trung_binh: filterType});
        }
    }
    else if((key != undefined) && (filter == undefined)) {
        hotels = await khachSan.find({
            $or: [
                {ten: {$regex: key, $options: 'i'}}, 
                {dia_chi: {$regex: key, $options: 'i'}}
            ]});
    }
    else if((key == undefined) && (filter != undefined)) {
        var filterType = filter.indexOf('Tang') != -1 ? 1 : -1;
        if(filter.indexOf('diem') == -1) {
            hotels = await khachSan.find().sort({gia: filterType});
        }
        else {
            hotels = await khachSan.find().sort({diem_trung_binh: filterType});
        }
    }
    else {
        hotels = await khachSan.find();
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
    params.basketTotal = GetAmountAndPriceInBasket(req);
    res.render('user/account', params);
}

module.exports.HotelDetail = async function(req, res) {
    var hotelID = req.params.hotelID;
    var hotel = await khachSan.findById(hotelID);
    var params = {
        hotel: hotel
    }
    var decode = req.session.decode;
    if(decode != undefined) {
        var accountID = decode.id;
        var account = await taiKhoan.findById(accountID);
        params.username = account.ho_ten;
        params.avatar = account.avatar;
        params.userID = account._id;
    }
    var roomTypes = await loaiPhong.find({ma_khach_san: hotelID});
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

    // Lấy tổng số lương và giá trong giỏ hàng
function GetAmountAndPriceInBasket(req) {
    var basket = req.session.basket;
    basket = basket == undefined ? [] : basket;
    var price = 0;
    var result = {
        amount: basket.length
    }
    for(var i=0; i<basket.length; i++) {
        var total = basket[i].roomTypePrice * basket[i].amountRoom * basket[i].amountDate;
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

    // Pagination
module.exports.GetHotelForPagination = async function(req, res) {
    var key = req.query.key;
    if(req.query.filter != '') {
        var filter = req.query.filter;
        var filterType = (filter.indexOf('Tang') != -1) ? 1 : -1;
        var hotels;
        if(filter.indexOf('diem') != -1) {
            hotels = await khachSan.find({
                $or: [
                    {ten: {$regex: key, $options: 'i'}}, 
                    {dia_chi: {$regex: key, $options: 'i'}}
                ]}).sort({diem_trung_binh: filterType});
        }
        else {
            hotels = await khachSan.find({
                $or: [
                    {ten: {$regex: key, $options: 'i'}}, 
                    {dia_chi: {$regex: key, $options: 'i'}}
                ]}).sort({gia: filterType});
        }
    }
    else {
        hotels = await khachSan.find({
            $or: [
                {ten: {$regex: key, $options: 'i'}}, 
                {dia_chi: {$regex: key, $options: 'i'}}
            ]});
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
                                    <img src="https://media-cdn.tripadvisor.com/media/photo-s/17/d7/40/08/chau-pho-hotel.jpg" alt="">\
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