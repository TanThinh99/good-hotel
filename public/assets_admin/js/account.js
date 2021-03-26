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
    var hoTen = document.getElementById('hoTen'+userID).innerHTML;
    var maVaiTro = document.getElementById('maVaiTro'+userID).value;
    var gioiTinh = document.getElementById('gioiTinh'+userID).value;
    var email = document.getElementById('email'+userID).value;
    var sdt = document.getElementById('sdt'+userID).value;

    document.getElementById('avatarModal').src = avatar;
    document.getElementById('idModal').innerHTML = userID;
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
    var userID = document.getElementById('idModal').innerHTML;
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
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/api/tai_khoan/grantRole/'+ userID,
        data: data,
        headers: {
            'Authorization': 'bearer '+ token
        }                
    })
    .then(function(response) {
        console.log(response);
        alert('cap nhat thanh cong!');

        // update user view
        var roleName = document.getElementById('option'+ roleSelected).innerHTML;
        document.getElementById('maVaiTro'+ userID).value = roleSelected;
        document.getElementById('vaiTro'+ userID).innerHTML = roleName;
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
} 