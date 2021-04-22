function AddRoomType() {
    var name = document.getElementById('name').value;
    var price = document.getElementById('price').value;
    var amountRoom = document.getElementById('amountRoom').value;
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
        alert('Thêm loại phòng thành công!')
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}