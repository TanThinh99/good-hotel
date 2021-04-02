function ChooseControl(self, typeContent) {    
    if(typeContent != '') {
        var navList = document.getElementsByClassName('infoNav');
        for (var i = 0; i < navList.length; i++) {
            navList[i].classList.remove('active-nav');
        }

        var contentList = document.getElementsByClassName('mainContent');
        for (var i = 0; i < contentList.length; i++) {
            contentList[i].style.display = 'none';
        }

        document.getElementById(typeContent).style.display = 'block';
        self.classList.add('active-nav');

        if(typeContent == 'infoContent') {
            document.getElementById('contentTitle').innerHTML = 'Thông tin cá nhân';
        }
        else if(typeContent == 'accountContent') {
            document.getElementById('contentTitle').innerHTML = 'Thông tin tài khoản';
        }
        else if(typeContent == 'checkRoomContent') {
            document.getElementById('contentTitle').innerHTML = 'Lịch sử đặt phòng';
        }
    }
    else {
        if(confirm('Quý khách sẽ đăng xuất?')) {
            return true;
        }
        else {
            return false;
        }
    }                
}

document.getElementById('avatar').onchange = function(event) {
    if(event.target.files.length != 0) {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
        var file = event.target.files[0];
        if (regex.test(file.name.toLowerCase())) {
            var reader = new FileReader();
            reader.onload = function(){
            var avatarImg = document.getElementById('avatarImg');
            avatarImg.src = reader.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        } 
        else {
            alert(file.name + " is not a valid image file.");
            document.getElementById('avatarImg').src = "";
        }
    }
    else {
        document.getElementById('avatarImg').src = "";
    }  
}

function ToggleSelect(id) {
    var obj = document.getElementById(id);
    if(obj.style.display == 'flex') {
        obj.style.display = 'none';
    }
    else {
        obj.style.display = 'flex';
    }
}

function ChooseCity(id, name) {
    document.getElementById('selectCityContent').style.display = 'none';
    document.getElementById('cityMain').innerHTML = name;

    // Check active class
    var cityChosenID = document.getElementById('cityChosen').value;
    if(cityChosenID != '') {
        document.getElementById('city'+ cityChosenID).classList.remove('active');
    }
    document.getElementById('city'+ id).classList.add('active');
    document.getElementById('cityChosen').value = id;

    DistrictAjax(id);
}

function DistrictAjax(cityID) {
    axios({
        method: 'GET',
        url: 'http://localhost:8000/district_of_city/'+ cityID
    })
    .then(function(response) {
        console.log(response);
        document.getElementById('containDistContent').innerHTML = response.data;
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function ChooseDist(id, name) {
    document.getElementById('selectDistContent').style.display = 'none';
    document.getElementById('distMain').innerHTML = name;

    // Check active class
    var distChosenID = document.getElementById('distChosen').value;
    document.getElementById('dist'+ distChosenID).classList.remove('active');

    document.getElementById('dist'+ id).classList.add('active');
    document.getElementById('distChosen').value = id;

    WardAjax(id);
}

function WardAjax(distID) {
    axios({
        method: 'GET',
        url: 'http://localhost:8000/wards_of_district/'+ distID
    })
    .then(function(response) {
        console.log(response);
        document.getElementById('containWardContent').innerHTML = response.data;
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function ChooseWard(id, name) {
    document.getElementById('selectWardContent').style.display = 'none';
    document.getElementById('wardMain').innerHTML = name;

    // Check active class
    var wardChosenID = document.getElementById('wardChosen').value;
    document.getElementById('ward'+ wardChosenID).classList.remove('active');

    document.getElementById('ward'+ id).classList.add('active');
    document.getElementById('wardChosen').value = id;
}

function UpdateInfo() {
    var wardID = document.getElementById('wardChosen').value;
    var address = '';
    if(wardID != '') {
        // Save address
        var wardName = document.getElementById('wardMain').innerHTML;
        var distName = document.getElementById('distMain').innerHTML;
        var cityName = document.getElementById('cityMain').innerHTML;
        var streetName = document.getElementById('streetName').value;
        streetName = streetName==''?'':streetName+', ';
        address = streetName + wardName +', '+ distName +', '+ cityName;
    }
    var hoTen = document.getElementById('name').value;
    var gioiTinh = document.getElementById('namRadio').checked ? true : false;
    var sdt = document.getElementById('phone').value;
    var avatar = document.getElementById('avatar');
    var formData = new FormData();
    if(avatar.files.length != 0) {
        formData.append('avatar', avatar.files[0]);
    }
    formData.append('ho_ten', hoTen);
    formData.append('gioi_tinh', gioiTinh);
    formData.append('so_dien_thoai', sdt);
    formData.append('dia_chi', address);
    formData.append('maxp', wardID);

    var accountID = document.getElementById('accountID').value;
    var token = document.getElementById('token').value;
    var csrfToken = document.getElementById('csrf_token').value;
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/api/tai_khoan/'+ accountID,
        data: formData,
        headers: {
            'Authorization': 'bearer '+ token,
            'CSRF-Token': csrfToken
        }                
    })
    .then(function(response) {
        console.log(response);
        alert('cap nhat thanh cong!')
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function UpdateAccount() {
    var pass1 = document.getElementById('pass1Info').value;
    var pass2 = document.getElementById('pass2Info').value;
    if((pass1 == pass2) && (pass1 != '')) {
        // Save account info
        var email = document.getElementById('emailInfo').value;
        var accountID = document.getElementById('accountID').value;
        var token = document.getElementById('token').value;
        var csrfToken = document.getElementById('csrf_token').value;
        axios({
            method: 'PUT',
            url: 'http://localhost:8000/api/tai_khoan/updateAccount/'+ accountID,
            data: {
                email: email,
                password: pass1
            },
            headers: {
                'Authorization': 'bearer '+ token,
                'CSRF-Token': csrfToken
            }                
        })
        .then(function(response) {
            console.log(response);
            alert('cap nhat thanh cong!')
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
    else {
        alert('Quý khách cần nhập mật khẩu mới và mật khẩu nhập lại giống nhau và không được rỗng!');
    }
}

    // For Bill
function GetBillDetail(billID) {
    axios({
        method: 'GET',
        url: 'http://localhost:8000/getBillDetail/'+ billID
    })
    .then(function(response) {
            // Appear bill detail
        var contentList = document.getElementsByClassName('mainContent');
        for (var i = 0; i < contentList.length; i++) {
            contentList[i].style.display = 'none';
        }
        var data = response.data;
        document.getElementById('hotelName').innerHTML = data.ma_loai_phong.ten;
        document.getElementById('roomTypeName').innerHTML = data.ma_loai_phong.ten;
        document.getElementById('roomTypePrice').innerHTML = data.gia_dat_phong;
        document.getElementById('checkRoomDate').innerHTML = data.ngay_dat_phong;
        document.getElementById('receiveRoomDate').innerHTML = data.ngay_nhan_phong;
        document.getElementById('returnRoomDate').innerHTML = data.ngay_tra_phong;
        document.getElementById('roomAmount').innerHTML = data.so_luong_phong;
        if(data.da_thanh_toan) {
            document.getElementById('roomStatus').innerHTML = 'Đã thanh toán';
            document.getElementById('roomStatus').style.color = 'green';
        }
        else {
            document.getElementById('roomStatus').innerHTML = 'Chưa thanh toán';
            document.getElementById('roomStatus').style.color = '#00bccb';
        }              
        document.getElementById('billDetailContent').style.display = 'block';
        document.getElementById('contentTitle').innerHTML = 'Chi tiết hóa đơn đặt phòng';
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });            
}

function PayBill(billID) {
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/payBill',
        data: {
            "billID": billID
        }                
    })
    .then(function(response) {
        alert('Thanh toán đơn đặt phòng thành công. Cảm ơn quý khách ^^');
        location.reload();
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function DestroyBill(billID) {
    if(confirm('Bạn sẽ xóa đơn đặt phòng này?')) {
        axios({
            method: 'DELETE',
            url: 'http://localhost:8000/destroyBill',
            data: {
                billID: billID
            }                
        })
        .then(function(response) {
            document.getElementById('bill'+ billID).hidden = true;
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }    
}