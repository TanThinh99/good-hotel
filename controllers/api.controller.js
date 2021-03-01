var tinhThanhModel = require('./../models/tinh_thanh_pho.model');

module.exports.get = async function(req, res) {
    var cities = await tinhThanhModel.find();
    res.json(cities);
}

// router.post('/add', uploads.single('hinhanh'), apiCtrl.callAPI);
module.exports.callAPI = async function(req, res) {
    req.body.hinhanh = req.file.filename;
    console.log(req.body);
    console.log(req.body.mota);
    console.log('soluong: '+ req.body.soluong);
    console.log('ten hinh: '+req.file.filename);

    obj = {
        ten: req.body.ten,
        ten1: req.body.mota,
        loai: req.body.gia,
        soluong: req.body.soluong,
        hinhanh: req.body.hinhanh
    }

    var result = await tinhThanhModel.insertMany([obj]);
    console.log(result);
    res.send('da ta xong: '+result);
}