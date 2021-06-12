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
            document.getElementById('avatar').value = '';
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
        url: '/district_of_city/'+ cityID
    })
    .then(function(response) {
        document.getElementById('containDistContent').innerHTML = response.data.distStr;
        WardAjax(response.data.firstDistID);
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
        url: '/wards_of_district/'+ distID
    })
    .then(function(response) {
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
    var hoTen = document.getElementById('name').value.trim();
    var sdt = document.getElementById('phone').value.trim();
    var displayStatus = hoTen == '' ? 'block' : 'none';
    document.getElementById('nameInfoErr').style.display = displayStatus;
    displayStatus = /^\d{10,11}$/.test(sdt) ? 'none' : 'block';
    document.getElementById('phoneInfoErr').style.display = displayStatus;
    if((hoTen == '') || !(/^\d{10,11}$/.test(sdt))) {
        return;
    }
    var wardID = document.getElementById('wardChosen').value;
    var address = '';
    if(wardID != '') {
        // Save address
        var wardName = document.getElementById('wardMain').innerHTML;
        var distName = document.getElementById('distMain').innerHTML;
        var cityName = document.getElementById('cityMain').innerHTML;
        var streetName = document.getElementById('streetName').value;
        streetName = streetName.trim() == '' ? '' : streetName+', ';
        address = streetName + wardName +', '+ distName +', '+ cityName;
    }
    var gioiTinh = document.getElementById('namRadio').checked ? true : false;
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
    ToggleLoading();
    axios({
        method: 'PUT',
        url: '/api/tai_khoan/'+ accountID,
        data: formData,
        headers: {
            'Authorization': 'bearer '+ token,
            'CSRF-Token': csrfToken
        }                
    })
    .then(function(response) {
        ToggleLoading();
        alert('Quý khách đã cập nhật thông tin thành công!')
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function UpdateAccount() {
    var email = document.getElementById('emailInfo').value.trim();
    var pass1 = document.getElementById('pass1Info').value;
    var pass2 = document.getElementById('pass2Info').value;
    var displayStatus = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email) ? 'none' : 'block';
    document.getElementById('emailInfoErr').style.display = displayStatus;
    displayStatus = pass1 != pass2 ? 'block' : 'none';
    document.getElementById('passAgainInfoErr').style.display = displayStatus;
    if(!(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email)) || (pass1 != pass2)) {
        return;
    }
    var accountID = document.getElementById('accountID').value;
    var token = document.getElementById('token').value;
    var csrfToken = document.getElementById('csrf_token').value;
    ToggleLoading();
    axios({
        method: 'PUT',
        url: '/api/tai_khoan/updateAccount/'+ accountID,
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
        ToggleLoading();
        alert('Quý khách đã cập nhật tài khoản thành công!')
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

    // For Bill
function ChoosePaginateItem(pageSelected) {
    ToggleLoading();
    axios({
        method: 'GET',
        url: '/getBillForPagination?pageSelected='+ pageSelected,
    })
    .then(function(response) {
        ToggleLoading();
        document.getElementById('containBills').innerHTML = response.data.billData;
        document.getElementById('containerPagiItem').innerHTML = response.data.paginateData;
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function GetBillDetail(billID) {
    axios({
        method: 'GET',
        url: '/getBillDetail/'+ billID
    })
    .then(function(response) {
            // Appear bill detail
        var contentList = document.getElementsByClassName('mainContent');
        for (var i = 0; i < contentList.length; i++) {
            contentList[i].style.display = 'none';
        }
        var data = response.data;
        document.getElementById('hotelName').innerHTML = data.ma_loai_phong.ma_khach_san.ten;
        document.getElementById('roomTypeName').innerHTML = data.ma_loai_phong.ten;
        document.getElementById('roomTypePrice').innerHTML = ShowMoney(data.gia_dat_phong);
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
    window.location.href = '/payBill?billID='+ billID;
}

function DestroyBill(billID) {
    if(confirm('Bạn sẽ xóa đơn đặt phòng này?')) {
        ToggleLoading();
        axios({
            method: 'DELETE',
            url: '/destroyBill',
            data: {
                billID: billID
            }                
        })
        .then(function(response) {
            ToggleLoading();
            document.getElementById('bill'+ billID).hidden = true;
        })
        .catch(function(err) {
            ToggleLoading();
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }    
}