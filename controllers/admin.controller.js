var fa47 = require('./../font-awesome-4.7.0.json');

const quyen = require("../models/quyen.model");
const taiKhoan = require("../models/tai_khoan.model");
const vaiTro = require("../models/vai_tro.model");
const vaiTroCoQuyen = require("../models/vai_tro_co_quyen.model");
const tienNghi = require("../models/tien_nghi.model");
const khachSan = require('../models/khach_san.model');

module.exports.Statistic = async function(req, res) {
    var decode = req.session.decode;
    var userAccount = await taiKhoan.findById(decode.id);
    var params = {
        userAccount: userAccount
    }
    res.render('admin/statistic', params);
}

module.exports.Account = async function(req, res) {
    var accounts;
    var key = req.query.key == undefined ? '': req.query.key;
    accounts = await taiKhoan.find({ho_ten: {$regex: key, $options: 'i'}}).populate('ma_vai_tro');
    var params = {
        foundByKey: key
    }
    // Pagination
    var amountItemInPage = 6;
    var itemTotal = accounts.length;
    var pageTotal = parseInt(itemTotal / amountItemInPage);
    if(itemTotal % amountItemInPage != 0) {
        pageTotal++;
    }
    var amountShowPage = pageTotal > 7 ? 7 : pageTotal;
    params.pageTotal = pageTotal;
    params.amountShowPage = amountShowPage;
    var accountArr = [];
    for(var i=0; i<amountItemInPage; i++) {
        if(accounts[i] == undefined) {
            break;
        }
        accountArr.push(accounts[i]);
    }
    params.accounts = accountArr;
    
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
    params.token = req.session.token;
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

module.exports.GetAccountForPagination = async function(req, res) {
    var key = req.query.key;
    var accounts = await taiKhoan.find({ho_ten: {$regex: key, $options: 'i'}}).populate('ma_vai_tro');
    // Pagination
    var pageSelected = req.query.pageSelected * 1;
    var amountItemInPage = 6;
    var itemTotal = accounts.length;
    var pageTotal = parseInt(itemTotal / amountItemInPage);
    if(itemTotal % amountItemInPage != 0) {
        pageTotal++;
    }
    var amountShowPage = pageTotal > 7 ? 7 : pageTotal;
    var itemFrom = (pageSelected * amountItemInPage) - amountItemInPage;
    var itemTo = (pageSelected * amountItemInPage) - 1;
    var accountArr = [];
    for(var i=itemFrom; i<=itemTo; i++) {
        if(accounts[i] == undefined) {
            break;
        }
        accountArr.push(accounts[i]);
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
    var accountData = '';
    for(i=0; i<accountArr.length; i++) {
        var gioiTinh = accountArr[i].gioi_tinh == 1 ? 'Nam' : 'Nữ';
        accountData += '<div class="col-lg-4 col-md-6 account">\
                            <div>\
                                <img class="user-avatar" id="avatar'+ accountArr[i]._id +'" src="/uploads/'+ accountArr[i].avatar +'" alt="">\
                            </div>\
                            <p>\
                                <b>ID: </b>\
                                <span>'+ accountArr[i]._id +'</span>\
                            </p>\
                            <p>\
                                <b>Tên: </b>\
                                <span id="hoTen'+ accountArr[i]._id +'">'+ accountArr[i].ho_ten +'</span>\
                            </p>\
                            <p>\
                                <b>Vai trò: </b>\
                                <span id="vaiTro'+ accountArr[i]._id +'">'+ accountArr[i].ma_vai_tro.ten +'</span>\
                                <input type="hidden", id="maVaiTro'+ accountArr[i]._id +'" value="'+ accountArr[i].ma_vai_tro._id +'">\
                                <input type="hidden", id="gioiTinh'+ accountArr[i]._id +'" value="'+ gioiTinh +'">\
                                <input type="hidden", id="email'+ accountArr[i]._id +'" value="'+ accountArr[i].email +'">\
                                <input type="hidden", id="sdt'+ accountArr[i]._id +'" value="'+ accountArr[i].so_dien_thoai +'">\
                            </p>\
                            <button class="btn btn-light mt-2" onclick="ShowUserDetail(\''+ accountArr[i]._id +'\')">Xem thêm</button>\
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
        accountData: accountData,
        paginateData: paginateData
    });
}

module.exports.FindHotelByKey = async function(req, res) {
    var key = (req.query.key).toLowerCase();
    var hotels = await khachSan.find();
    var hotelData = '';
    for(var i=0; i<hotels.length; i++) {
        var _id = (hotels[i]._id +'').toLowerCase();
        var hotelName = hotels[i].ten.toLowerCase();
        if((_id.indexOf(key) != -1) || (hotelName.indexOf(key) != -1)) {
            hotelData += '<div class="hotel col-sm-5" id="hotel'+ hotels[i]._id +'" onclick="ChooseItemGrant(\'hotel\', \''+ hotels[i]._id +'\')">\
                            <p><i class="fa fa-id-card-o" aria-hidden="true"></i>'+ hotels[i]._id +'</p>\
                            <p><i class="fa fa-hospital-o" aria-hidden="true"></i>'+ hotels[i].ten +'</p>\
                            <p><i class="fa fa-map-marker" aria-hidden="true"></i>'+ hotels[i].dia_chi +'</p>\
                        </div>';
        }
    }
    res.send({
        hotelData: hotelData
    })
}

module.exports.FindManagerByKey = async function(req, res) {
    // Get roles have this permission "Vao trang quan ly khach san"
    var permissName = 'Vao trang quan ly khach san';
    var permission = await quyen.findOne({ten: permissName});
    var rolesHaveThisPermiss = await vaiTroCoQuyen.find({ma_quyen: permission._id});
    var roleArr = [];
    for(var i=0; i<rolesHaveThisPermiss.length; i++) {
        roleArr.push(rolesHaveThisPermiss[i].ma_vai_tro);
    }

    var key = (req.query.key).toLowerCase();
    var accounts = await taiKhoan.find({ma_vai_tro: {$in: roleArr}});
    var managerData = '';
    for(var i=0; i<accounts.length; i++) {
        var _id = (accounts[i]._id +'').toLowerCase();
        var managerName = accounts[i].ho_ten.toLowerCase();
        if((_id.indexOf(key) != -1) || (managerName.indexOf(key) != -1)) {
            managerData += '<div class="hotel col-sm-5" id="manager'+ accounts[i]._id +'" onclick="ChooseItemGrant(\'manager\', \''+ accounts[i]._id +'\')">\
                                <p><i class="fa fa-id-card-o" aria-hidden="true"></i>'+ accounts[i]._id +'</p>\
                                <p><i class="fa fa-user" aria-hidden="true"></i>'+ accounts[i].ho_ten +'</p>\
                                <p><i class="fa fa-phone" aria-hidden="true"></i>'+ accounts[i].so_dien_thoai +'</p>\
                            </div>';
        }
    }
    res.send({
        managerData: managerData
    })
}