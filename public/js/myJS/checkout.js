function CheckLogin() {
    var token = document.getElementById('token').value;
    if(token == '') {
        alert('Quý khách vui lòng đăng nhập để có thể tạo đơn đặt phòng');
        return false;
    }
    return true;
}

function CreateBill() {
    if(CheckLogin() == false) {
        return;
    }
    var token = document.getElementById('token').value;
    axios({
        method: 'POST',
        url: 'http://localhost:8000/api/hoa_don',
        headers: {
            'Authorization': 'bearer '+ token
        }            
    })
    .then(function(response) {
        alert('Cảm ơn quý khách đã đặt phòng trên website ^^');
        location.reload();
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });            
}