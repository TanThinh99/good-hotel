function AddRoomType() {
    var name = document.getElementById('name').value.trim();
    var price = document.getElementById('price').value.trim();
    var amountRoom = document.getElementById('amountRoom').value.trim();
    var displayStatus = name == '' ? 'block' : 'none';
    document.getElementById('nameInfoErr').style.display = displayStatus;
    displayStatus = price == '' ? 'block' : 'none';
    document.getElementById('priceInfoErr').style.display = displayStatus;
    displayStatus = amountRoom == '' ? 'block' : 'none';
    document.getElementById('amountRoomInfoErr').style.display = displayStatus;
    if((name == '') || (price == '') || (amountRoom == '')) {
        return;
    }

    price = parseInt(price);
    displayStatus = price < 1 ? 'block' : 'none';
    document.getElementById('priceInfoErr').style.display = displayStatus;
    amountRoom = parseInt(amountRoom);
    displayStatus = amountRoom < 1 ? 'block' : 'none';
    document.getElementById('amountRoomInfoErr').style.display = displayStatus;
    if((price < 1) || (amountRoom < 1)) {
        return;
    }

    var image360 = document.getElementById('image360').value;
    var ma_khach_san = document.getElementById('hotelID').value;
    var token = document.getElementById('token').value;
    var csrfToken = document.getElementById('csrfToken').value;
    axios({
        method: 'POST',
        url: 'http://localhost:8000/api/loai_phong',
        data: {
            ten: name,
            gia: price,
            so_luong: amountRoom,
            hinh_anh_360: image360,
            ma_khach_san: ma_khach_san
        },
        headers: {
            'Authorization': 'bearer '+ token,
            'CSRF-Token': csrfToken
        }                                  
    })
    .then(function(response) {
        alert('Thêm loại phòng thành công!');
        window.location.href = 'http://localhost:8000/manager/roomType';
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}