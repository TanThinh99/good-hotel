var fa47 = require('./../font-awesome-4.7.0.json');

const quyen = require("../models/quyen.model");
const taiKhoan = require("../models/tai_khoan.model");
const vaiTro = require("../models/vai_tro.model");
const vaiTroCoQuyen = require("../models/vai_tro_co_quyen.model");
const tienNghi = require("../models/tien_nghi.model");

module.exports.Statistic = async function(req, res) {
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    var params = {
        userAccount: userAccount
    }
    res.render('admin/statistic', params);
}

module.exports.Account = async function(req, res) {
    var accounts = await taiKhoan.find().populate('ma_vai_tro');
    var params = {
        accounts: accounts
    }
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    params.userAccount = userAccount;

    var roles = await vaiTro.find();
    params.roles = roles;

    // Lấy các vai trò có quyền: Vào trang quản lý khách sạn
    var permiss = await quyen.findOne({ten: 'Vao trang quan ly khach san'});
    var roles = await vaiTroCoQuyen.find({ma_quyen: permiss._id});
    var managerStr = '';
    for(i=0; i<roles.length; i++) {
        managerStr += roles[i].ma_vai_tro +',';
    }
    params.managerStr = managerStr.slice(0, managerStr.length-1);

    // token
    params.token = req.session.token;
    res.render('admin/account', params);
}

module.exports.Convenient = async function(req, res) {
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    var params = {
        userAccount: userAccount
    }
    var convens = await tienNghi.find();
    params.convens = convens;
    params.token = req.session.token;
    res.render('admin/convenient', params);
}

module.exports.UpdateConvenient = async function(req, res) {
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    var params = {
        userAccount: userAccount
    }
    params.fa47 = fa47['4.7.0'];
    params.token = req.session.token;

    var convenID = req.params.convenientID;
    var conven = await tienNghi.findById(convenID);
    params.conven = conven;
    res.render('admin/updateConvenient', params);
}

module.exports.AddConvenient = async function(req, res) {
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    var params = {
        userAccount: userAccount
    }
    params.fa47 = fa47['4.7.0'];
    params.token = req.session.token;
    res.render('admin/addConvenient', params);
}

module.exports.Role = async function(req, res) {
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    var params = {
        userAccount: userAccount
    }
    var roles = await vaiTro.find().sort({disabled: 1});
    params.roles = roles;
    params.token = req.session.token;
    res.render('admin/role', params);
}

module.exports.GrantPermission = async function(req, res) {
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    var params = {
        userAccount: userAccount
    }
    var roleID = req.params.roleID;
    var permissions = await vaiTroCoQuyen.find({ma_vai_tro: roleID}).populate('ma_quyen');
    params.roleID = roleID;
    params.permissions = permissions;
    var permissIDArr = [];
    for(i=0; i<permissions.length; i++) {
        permissIDArr.push(permissions[i].ma_quyen);
    }
    var notPermissions = await quyen.find({_id: {$nin: permissIDArr}});
    params.notPermissions = notPermissions;
    params.token = req.session.token;
    res.render('admin/grantPermission', params);
}

module.exports.GrantManager = async function(req, res) {
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    var params = {
        userAccount: userAccount
    }
    res.render('admin/grantManager', params);
}

module.exports.UpdateRole = async function(req, res) {
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    var params = {
        userAccount: userAccount
    }
    var roleID = req.params.roleID;
    var role = await vaiTro.findById(roleID);
    params.role = role;
    params.token = req.session.token;
    res.render('admin/updateRole', params);
}

module.exports.AddRole = async function(req, res) {
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    var params = {
        userAccount: userAccount
    }
    params.token = req.session.token;
    res.render('admin/addRole', params);
}

