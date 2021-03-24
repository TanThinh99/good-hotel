var express = require('express');
var router = express.Router();

var apiMid = require('./../middlewares/api/api.middleware');

var userApiCtrl = require('./../controllers/api/userApi.controller');
var tinhThanhCtrl = require('./../controllers/api/tinh_thanh.controller');
var quanHuyenCtrl = require('./../controllers/api/quan_huyen.controller');
var xaPhuongCtrl = require('./../controllers/api/xa_phuong.controller');
var khachSanCtrl = require('./../controllers/api/khach_san.controller');
var tienNghiCtrl = require('./../controllers/api/tien_nghi.controller');
var tienNghiKSCtrl = require('./../controllers/api/tien_nghi_khach_san.controller');
var loaiPhongCtrl = require('./../controllers/api/loai_phong.controller');
var hinhAnhCtrl = require('./../controllers/api/hinh_anh.controller');
var vaiTroCtrl = require('./../controllers/api/vai_tro.controller');
var quyenCtrl = require('./../controllers/api/quyen.controller');
var vaiTroCoQuyenCtrl = require('./../controllers/api/vai_tro_co_quyen.controller');
var taiKhoanCtrl = require('./../controllers/api/tai_khoan.controller');
var binhLuanCtrl = require('./../controllers/api/binh_luan.controller');
var hoaDonCtrl = require('./../controllers/api/hoa_don.controller');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, Date.now() +'-'+ file.originalname);
    }
});
var uploads = multer({ storage: storage });

// USER
router.post('/postLoginTest', userApiCtrl.PostLoginTest);
router.post('/postLogin', userApiCtrl.PostLogin);

// Tinh_thanh
router.get('/tinh_thanh', tinhThanhCtrl.List);
router.post('/tinh_thanh', tinhThanhCtrl.Add);
router.get('/tinh_thanh/:id', tinhThanhCtrl.Detail);
router.put('/tinh_thanh/:id', tinhThanhCtrl.Update);
router.delete('/tinh_thanh/:id', tinhThanhCtrl.Delete);

// Quan huyen
router.get('/quan_huyen', quanHuyenCtrl.List);
router.post('/quan_huyen', quanHuyenCtrl.Add);
router.get('/quan_huyen/:id', quanHuyenCtrl.Detail);
router.put('/quan_huyen/:id', quanHuyenCtrl.Update);
router.delete('/quan_huyen/:id', quanHuyenCtrl.Delete);

// Xa_phuong
router.get('/xa_phuong', xaPhuongCtrl.List);
router.post('/xa_phuong', xaPhuongCtrl.Add);
router.get('/xa_phuong/:id', xaPhuongCtrl.Detail);
router.put('/xa_phuong/:id', xaPhuongCtrl.Update);
router.delete('/xa_phuong/:id', xaPhuongCtrl.Delete);

// Khach_san
router.get('/khach_san', khachSanCtrl.List);
router.post('/khach_san', apiMid.CheckLogin, apiMid.AddKhachSan, khachSanCtrl.Add);
router.get('/khach_san/:id', khachSanCtrl.Detail);
router.put('/khach_san/:id', apiMid.CheckLogin, apiMid.UpdateKhachSan, khachSanCtrl.Update);
router.delete('/khach_san/:id', apiMid.CheckLogin, apiMid.DeleteKhachSan, khachSanCtrl.Delete);

// Tiện nghi
router.get('/tien_nghi', tienNghiCtrl.List);
router.post('/tien_nghi', apiMid.CheckLogin, apiMid.AddTienNghi, tienNghiCtrl.Add);
router.get('/tien_nghi/:id', tienNghiCtrl.Detail);
router.put('/tien_nghi/:id', apiMid.CheckLogin, apiMid.UpdateTienNghi, tienNghiCtrl.Update);
router.delete('/tien_nghi/:id', apiMid.CheckLogin, apiMid.DeleteTienNghi, tienNghiCtrl.Delete);

// Tiện nghi khách sạn
router.get('/tien_nghi_ks', tienNghiKSCtrl.List);
router.post('/tien_nghi_ks', apiMid.CheckLogin, apiMid.AddTienNghiKS, tienNghiKSCtrl.Add);
router.get('/tien_nghi_ks/:id', tienNghiKSCtrl.Detail);
router.delete('/tien_nghi_ks/:id', apiMid.CheckLogin, apiMid.DeleteTienNghiKS, tienNghiKSCtrl.Delete);

// Loại phòng
router.get('/loai_phong', loaiPhongCtrl.List);
router.post('/loai_phong', apiMid.CheckLogin, apiMid.AddLoaiPhong, loaiPhongCtrl.Add);
router.get('/loai_phong/:id', loaiPhongCtrl.Detail);
router.put('/loai_phong/:id', apiMid.CheckLogin, apiMid.UpdateLoaiPhong, loaiPhongCtrl.Update);
router.delete('/loai_phong/:id', apiMid.CheckLogin, apiMid.DeleteLoaiPhong, loaiPhongCtrl.Delete);

// Hình ảnh
router.get('/hinh_anh', hinhAnhCtrl.List);
router.post('/hinh_anh', apiMid.CheckLogin, apiMid.AddHinhAnh, uploads.any(), hinhAnhCtrl.Add);
router.get('/hinh_anh/:id', hinhAnhCtrl.Detail);
router.delete('/hinh_anh/:id', apiMid.CheckLogin, apiMid.DeleteHinhAnh, hinhAnhCtrl.Delete);

// Vai trò
router.get('/vai_tro', vaiTroCtrl.List);
router.post('/vai_tro', apiMid.CheckLogin, apiMid.AddVaiTro, vaiTroCtrl.Add);
router.get('/vai_tro/:id', vaiTroCtrl.Detail);
router.put('/vai_tro/:id', apiMid.CheckLogin, apiMid.UpdateVaiTro, vaiTroCtrl.Update);
router.delete('/vai_tro/:id', apiMid.CheckLogin, apiMid.DeleteVaiTro, vaiTroCtrl.Delete);
router.get('/vai_tro/co_quyen/:id', vaiTroCtrl.HavePermission);

// Quyền
router.get('/quyen', quyenCtrl.List);
router.post('/quyen', quyenCtrl.Add);
router.get('/quyen/:id', quyenCtrl.Detail);
router.put('/quyen/:id', quyenCtrl.Update);
router.delete('/quyen/:id', quyenCtrl.Delete);

// Vai trò có quyền
router.get('/vai_tro_co_quyen', vaiTroCoQuyenCtrl.List);
router.post('/vai_tro_co_quyen', apiMid.CheckLogin, apiMid.AddVaiTroCoQuyen, vaiTroCoQuyenCtrl.Add);
router.get('/vai_tro_co_quyen/:id', vaiTroCoQuyenCtrl.Detail);
router.delete('/vai_tro_co_quyen/:id', apiMid.CheckLogin, apiMid.DeleteVaiTroCoQuyen, vaiTroCoQuyenCtrl.Delete);

// Tai_khoan
router.get('/tai_khoan', taiKhoanCtrl.List);
router.post('/tai_khoan', taiKhoanCtrl.Add);
router.get('/tai_khoan/:id', taiKhoanCtrl.Detail);
router.put('/tai_khoan/:id', apiMid.CheckLogin, apiMid.UpdateTaiKhoan, uploads.single('avatar'), taiKhoanCtrl.UpdateInfo);
router.put('/tai_khoan/updateAccount/:id', apiMid.CheckLogin, apiMid.UpdateTaiKhoan, taiKhoanCtrl.UpdateAccount);
router.put('/tai_khoan/grantRole/:id', taiKhoanCtrl.GrantRole);

// Bình luận
    // Member bình luận
router.get('/binh_luan', binhLuanCtrl.List);
router.get('/binh_luan/:id', binhLuanCtrl.Detail);
router.post('/binh_luan/member', binhLuanCtrl.MemberAdd);
router.put('/binh_luan/member/:id', binhLuanCtrl.MemberUpdate);
router.delete('/binh_luan/member/:id', binhLuanCtrl.MemberDelete);

    // Manager bình luận
router.put('/binh_luan/manager/:id', binhLuanCtrl.ManagerUpdate);
router.delete('/binh_luan/manager/:id', binhLuanCtrl.ManagerDelete);
router.put('/binh_luan/confirmSeen/:id', binhLuanCtrl.ConfirmSeen);

// Hóa đơn
router.get('/hoa_don', hoaDonCtrl.List);
router.post('/hoa_don', hoaDonCtrl.Add);
router.get('/hoa_don/:id', hoaDonCtrl.Detail);
router.put('/hoa_don/tra_phong/:id', hoaDonCtrl.ConfirmReturnedRoom);

var mid = require('./../middlewares/middleware');
router.get('/callAPI', mid.IsAdmin, function(req, res) {
    res.render('test', {});
});

module.exports = router;