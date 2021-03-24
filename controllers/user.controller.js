var axios = require('axios');
const taiKhoan = require('../models/tai_khoan.model');
const tinhThanh = require('../models/tinh_thanh_pho.model');
const quanHuyen = require('../models/quan_huyen.model');
const xaPhuong = require('../models/xa_phuong.model');

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
    if(decode != undefined) {
        var accountID = decode.id;
        var account = await taiKhoan.findById(accountID).exec();
        params.username = account.ho_ten;
        params.account = account;
    }
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
    res.render('user/account', params);
}

module.exports.HotelDetail = async function(req, res) {
    var hotelID = req.params.hotelID;
    var hotel = await axios({
        method: 'GET',
        url: 'http://localhost:8000/api/khach_san/'+ hotelID
    });
    res.render('user/hotelDetail', {
        hotel: hotel.data
    });
}

module.exports.Basket = function(req, res) {
    res.render('user/basket');
}

module.exports.Logout = function(req, res) {
    req.session.token = undefined;
    req.session.decode = undefined;
    res.redirect('/');
}

//============= AJAX ===============
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