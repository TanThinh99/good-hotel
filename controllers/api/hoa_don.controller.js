var jwt = require('jsonwebtoken');

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

module.exports.Add = function(req, res) {
    var authorization = req.headers.authorization;
    var tokenArr = authorization.split(' ');

    var date = new Date();
    var month = FormatNumberInDate(date.getMonth() + 1);
    var day = FormatNumberInDate(date.getDate());
    var hour = FormatNumberInDate(date.getHours());
    var minute = FormatNumberInDate(date.getMinutes());
    var second = FormatNumberInDate(date.getSeconds());    
    var time = date.getFullYear() +"-"+ month +"-"+ day +" "+ hour +":"+ minute +":"+ second;
    jwt.verify(tokenArr[1], process.env.SECRET_JWT, function(err, decode) {
        var objArr = [];
        var basket = req.session.basket;
        if(basket == undefined) {
            basket = [];
        }
        for(i=0; i<basket.length; i++) {
            var obj = {
                ngay_dat_phong: time,
                ngay_nhan_phong: basket[i].fromDate,
                ngay_tra_phong: basket[i].toDate,
                gia_dat_phong: basket[i].roomTypePrice,
                so_luong_phong: basket[i].amountRoom,
                da_thanh_toan: false,
                da_tra_phong: false,
                ma_tai_khoan: decode.id,
                ma_loai_phong: basket[i].roomTypeID
            }
            objArr.push(obj);
        } 
        req.session.basket = [];       
        hoaDonModel.insertMany(objArr, function(err, doc) {
            if (err) throw err;
            res.json(doc);
        });        
    });    
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await hoaDonModel.findById(id).exec();
    res.json(doc);
}