var tinhThanhModel = require('./../../models/tinh_thanh_pho.model');

module.exports.List = async function(req, res) {
    var list = await tinhThanhModel.find();
    res.json(list);
}

module.exports.Add = function(req, res) {
    console.log(req.body);   
    console.log(req.body.ten);
    console.log(req.files);   
     
    var obj = {
        ten: req.body.ten,
        loai: req.body.loai
    }
    try {
        // var newCity = await tinhThanhModel.insertMany([obj]);
    } catch (error) {
        console.log('loi');
    }    
    res.json('xong');
}