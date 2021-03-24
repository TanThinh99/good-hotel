var hotelID = document.getElementById('hotelID').value;
var thongTinNavItem = document.getElementById('thongTinNavItem');
var tienNghiNavItem = document.getElementById('tienNghiNavItem');
var loaiPhongNavItem = document.getElementById('loaiPhongNavItem');
var datPhongNavItem = document.getElementById('datPhongNavItem');
var binhLuanNavItem = document.getElementById('binhLuanNavItem');
var hoaDonNavItem = document.getElementById('hoaDonNavItem');

thongTinNavItem.href = '/manager/'+ hotelID;
tienNghiNavItem.href = '/manager/'+ hotelID + '/convenient';
loaiPhongNavItem.href = '/manager/'+ hotelID + '/roomType';
datPhongNavItem.href = '/manager/'+ hotelID + '/checkRoom';
binhLuanNavItem.href = '/manager/'+ hotelID + '/comment';
hoaDonNavItem.href = '/manager/'+ hotelID + '/bill';