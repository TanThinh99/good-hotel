var fs = require('fs');

var hinhAnhModel = require('./../../models/hinh_anh.model');

module.exports.List = async function(req, res) {
    var doc = await hinhAnhModel.find();
    res.json(doc);
}

module.exports.Add = function(req, res) {
    var objList = [];
    for(i=0; i<req.files.length; i++) {
        var obj = {
            ma_loai_phong: req.body.ma_loai_phong,
            ma_khach_san: req.body.ma_khach_san
        }
        obj.ten = req.files[i].filename;
        objList.push(obj);
    }
    var doc = hinhAnhModel.insertMany(objList, function(err, docs) {
        res.json(docs);
    });    
}

module.exports.Detail = async function(req, res) {
    var id = req.params.id;
    var doc = await hinhAnhModel.findById(id).exec();
    res.json(doc);
}

module.exports.Delete = async function(req, res) {
    var id = req.params.id;
    var doc = await hinhAnhModel.findByIdAndDelete(id);
    var filename = doc.ten;
    fs.unlink('./public/uploads/'+ filename, function(err) {
        if (err) throw err;
        console.log("File deleted!");
        res.json("File deleted!")
    });    
}