function DaXem(commentID) {
    if(confirm('Bạn đã xem bình luận này rồi?')) {
        var token = document.getElementById('token').value;
        ToggleLoading();
        axios({
            method: 'PUT',
            url: '/api/binh_luan/confirmSeen/'+ commentID,
            headers: {
                'Authorization': 'bearer '+ token
            }
        })
        .then(function(response) {
            ToggleLoading();
            location.reload();
        })
        .catch(function(err) {
            ToggleLoading();
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

function UpdateReply() {
    var content = document.getElementById('replyContent').value.trim();
    var displayStatus = content == '' ? 'block' : 'none';
    document.getElementById('contentReplyErr').style.display = displayStatus;
    if(content == '') {
        return;
    }
    var token = document.getElementById('token').value;
    var commentID = document.getElementById('commentID').value;
    ToggleLoading();
    axios({
        method: 'PUT',
        url: '/api/binh_luan/manager/'+ commentID,
        data: {
            noi_dung_phan_hoi: content.trim()
        },
        headers: {
            'Authorization': 'bearer '+ token
        }
    })
    .then(function(response) {
        ToggleLoading();
        alert('Đã lưu lại phản hồi cho khách hàng!');
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
        url: '/manager/getCommentForPagination?key='+ key +'&pageSelected='+ pageSelected,
    })
    .then(function(response) {
        ToggleLoading();
        document.getElementById('containerComments').innerHTML = response.data.commentData;
        document.getElementById('containerPagiItem').innerHTML = response.data.paginateData;
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

document.getElementById('filterCommentBtn').onclick = function() {
    var key = document.getElementById('foundByKey').value;
    window.location.href = '/manager/comment?key='+ key;
}