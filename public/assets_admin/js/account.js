var managerRoles = document.getElementById('managerRoles').value;
var managerArr = managerRoles.split(',');
document.getElementById('roleSelect').onchange = function() {
    var manager = this.value;
    var result = managerArr.find(function(value) {
        return manager == value;
    });
    if(result != undefined) {
        document.getElementById('newHotelDiv').hidden = false;
    }
    else {
        document.getElementById('newHotelDiv').hidden = true;
    }
}

function ShowUserDetail(userID) {
    var avatar = document.getElementById('avatar'+userID).src;
    var username = document.getElementById('username'+userID).innerHTML;
    var hoTen = document.getElementById('hoTen'+userID).innerHTML;
    var maVaiTro = document.getElementById('maVaiTro'+userID).value;
    var gioiTinh = document.getElementById('gioiTinh'+userID).value;
    var email = document.getElementById('email'+userID).value;
    var sdt = document.getElementById('sdt'+userID).value;

    document.getElementById('idModal').value = userID;
    document.getElementById('avatarModal').src = avatar;
    document.getElementById('usernameModal').innerHTML = username;
    document.getElementById('hoTenModal').innerHTML = hoTen;
    document.getElementById('gioiTinhModal').innerHTML = gioiTinh;
    document.getElementById('emailModal').innerHTML = email;
    document.getElementById('sdtModal').innerHTML = sdt;
    document.getElementById('roleSelect').value = maVaiTro;

    document.getElementById('newHotelDiv').hidden = true;
    document.getElementById('newHotel').checked = false;
    document.getElementById('openModalBtn').click();
}

function UpdateRole() {
    var userID = document.getElementById('idModal').value;
    var roleSelected = document.getElementById('roleSelect').value;
    var token = document.getElementById('token').value;
    var data = {
        ma_vai_tro: roleSelected
    }
    var newHotel = document.getElementById('newHotel').checked;
    if( newHotel ) {
        // Tạo khách sạn mới
        data.ma_khach_san = 'new';
    }
    ToggleLoading();
    axios({
        method: 'PUT',
        url: '/api/tai_khoan/grantRole/'+ userID,
        data: data,
        headers: {
            'Authorization': 'bearer '+ token
        }                
    })
    .then(function(response) {
        ToggleLoading();
        alert('Đã cập nhật lại vai trò cho tài khoản!');

        // update user view
        var roleName = document.getElementById('option'+ roleSelected).innerHTML;
        document.getElementById('maVaiTro'+ userID).value = roleSelected;
        document.getElementById('vaiTro'+ userID).innerHTML = roleName;
        document.getElementById('closeModal').click();
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function ChoosePaginateItem(pageSelected) {
    var key = document.getElementById('foundByKey').value;
    ToggleLoading();
    axios({
        method: 'GET',
        url: '/admin/getAccountForPagination?key='+ key +'&pageSelected='+ pageSelected,
    })
    .then(function(response) {
        ToggleLoading();
        document.getElementById('containerAccount').innerHTML = response.data.accountData;
        document.getElementById('containerPagiItem').innerHTML = response.data.paginateData;
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

document.getElementById('filterAccountBtn').onclick = function() {
    var key = document.getElementById('foundByKey').value;
    window.location.href = '/admin/account?key='+ key;
}