function DaXem(commentID) {
    var token = document.getElementById('token').value;
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/api/binh_luan/confirmSeen/'+ commentID,
        headers: {
            'Authorization': 'bearer '+ token
        }
    })
    .then(function(response) {
        location.reload();
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function UpdateReply() {
    var token = document.getElementById('token').value;
    var commentID = document.getElementById('commentID').value;
    var content = document.getElementById('replyContent').value;
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/api/binh_luan/manager/'+ commentID,
        data: {
            noi_dung_phan_hoi: content.trim()
        },
        headers: {
            'Authorization': 'bearer '+ token
        }
    })
    .then(function(response) {
        alert('Đã lưu lại phản hồi cho khách hàng!');
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}