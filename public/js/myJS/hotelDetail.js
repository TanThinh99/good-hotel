var images = [];
images[0] = 'https://noithatamber.vn/images/uploaded/ph%C3%B2ng%20ng%E1%BB%A7%202.jpg';
images[1] = 'https://lh3.googleusercontent.com/proxy/1KNaPxJGDd6XEV4ld80qi5oz3Dgsjli7VtxFSN3fiM1-zvY-s674JJytGS_xZRbTzaKwuhkQqF9WmOhu6aqRbF_Y0cHrgSFz6RV71pkMTAfe_9_GBOMcgOaoIXW70oGZbn_S0FSRVjaaggKoPwiauUuWDfbWAA';
images[2] = 'https://wedo.vn/wp-content/uploads/2019/07/thiet-ke-phong-ngu-15m2-12.jpg';
images[3] = 'https://wedo.vn/wp-content/uploads/2018/08/thiet-ke-noi-that-phong-ngu-15m2-dep-4.jpg';
images[4] = 'https://xuongnoithatdep.com/upload/images/combo-noi-that-phong-ngu-2.png';
images[5] = 'https://afamilycdn.com/150157425591193600/2020/5/25/7-15903740976832059393369-63-0-1001-1500-crop-1590374332746174200395.jpg';

var pos = 0;
function TurnImage(direction) {
    document.getElementById('img'+ pos).classList.remove('active');
    if( direction == 'left') {
        if(pos == 0) {
            pos = images.length - 1;
        }
        else {
            pos--;
        }
    }
    else if( direction == 'right') {
        if(pos == (images.length - 1)) {
            pos = 0;
        }
        else {
            pos++;
        }
    }
    document.getElementById('img'+ pos).classList.add('active');
    document.getElementById('imgMain').src = images[pos];
}

function ChooseImage(position) {
    document.getElementById('img'+ pos).classList.remove('active');
    
    pos = position;
    document.getElementById('img'+ pos).classList.add('active');
    document.getElementById('imgMain').src = images[pos];
}

function ChooseCarouselImage(position) {
    document.getElementById('img'+ pos).classList.remove('active');
    
    pos = position;
    document.getElementById('img'+ pos).classList.add('active');
    document.getElementById('imgMain').src = images[pos];

    document.getElementById('imageListSlider').style.display = 'block';
}

function ChooseRoomType(roomTypeID) {
    document.getElementById('roomTypeIDSelected').value = roomTypeID;
}

function SetFromDate() {
        // FROM DATE
    var today = new Date();
    var date = today.getDate();
    if(date < 10) {
        date = '0'+ date;
    }
    var month = today.getMonth() + 1;
    if(month < 10) {
        month = '0'+ month;
    }
    document.getElementById('fromDate').min = today.getFullYear() +'-'+ month +'-'+ date;
        // LIMIT DATE
    month = month*1 + 3;
    var year = today.getFullYear();
    if(month > 12) {
        month = month - 12;
        year++;
    }
    var limitDate = new Date(year +'-'+ month +'-'+ date);
    month = limitDate.getMonth();
    if(month < 10) {
        month = '0'+ month;
    }
    date = limitDate.getDate();
    if(date < 10) {
        date = '0'+ date;
    }
    document.getElementById('fromDate').max = year +'-'+ month +'-'+ date;
}
SetFromDate();

document.getElementById('fromDate').onchange = function(req, res) {
    var fromDate = document.getElementById('fromDate').value;
    document.getElementById('toDate').min = fromDate;
}

function CheckRoom() {            
    var amountRoom = document.getElementById('amountRoom').value;
    var fromDate = document.getElementById('fromDate').value;
    var toDate = document.getElementById('toDate').value;
    if((amountRoom == '') || (fromDate == '') || (toDate == '')) {
        alert('Quý khách vui lòng điền đầy đủ thông tin để tạo đơn đặt phòng!');
        return;
    }
    if(fromDate > toDate) {
        alert('Ngày nhận phòng phải trước ngày trả phòng!!');
    }
    else {
        var roomTypeID = document.getElementById('roomTypeIDSelected').value;
        axios({
            method: 'POST',
            url: 'http://localhost:8000/addToBasket',
            data: {
                roomTypeID: roomTypeID,
                amountRoom: amountRoom,
                fromDate: fromDate,
                toDate: toDate
            }            
        })
        .then(function(response) {
            alert('Đã thêm đơn đặt phòng vào giỏ hàng!');
            document.getElementById('amountRoom').value = '';
            document.getElementById('fromDate').value = '';
            document.getElementById('toDate').value = '';
            document.getElementById('closeCheckRoom').click();
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

function SaveComment() {
    var token = document.getElementById('token').value;
    if(token == '') {
        alert('Bạn cần phải đăng nhập để tạo bình luận!');
        return;
    }
    var commentID = document.getElementById('commentUpdating').value;
    if(commentID == '') {
        CreateComment();
    }
    else {
        UpdateComment(commentID);
    }
    CloseCommentModal();
}

function CreateComment() {
    var token = document.getElementById('token').value;
    var score = document.getElementById('commentScore').value;
    var goodReview = document.getElementById('good-review').value;
    var badReview = document.getElementById('bad-review').value;
    var hotelID = document.getElementById('hotelID').value;
    axios({
        method: 'POST',
        url: 'http://localhost:8000/api/binh_luan/member',
        data: {
            noi_dung_tot: goodReview,
            noi_dung_xau: badReview,
            diem: score,
            ma_khach_san: hotelID
        },
        headers: {
            'Authorization': 'bearer '+ token
        }
    })
    .then(function(response) {
        var yourName = document.getElementById('yourName').value;
        var avatar = document.getElementById('yourAvatar').value;
        var data = response.data[0];
        var str = '<div class="review">\
                    <img src="/uploads/'+ avatar +'" style="width:80px; border-radius:50%; float:left;">\
                    <div class="desc">\
                        <h4>\
                            <span class="text-left review-name">'+ yourName +'</span>\
                            <span class="text-right review-time" id="time'+ data._id +'">'+ data.thoi_gian +'</span>\
                        </h4>\
                        <p class="star">\
                            <span id="score'+ data._id +'">'+ data.diem +'.0</span>\
                            <span class="ml-3">\
                                <i class="fa fa-pencil aria-hidden="true" title="Chỉnh sửa" style="cursor:pointer;" data-toggle="modal" data-target="#commentModal" onclick=\'OpenUpdateComment("'+ data._id +'")\'></i>\
                            </span>\
                            <span class="ml-1">\
                                <i class="fa fa-trash-o aria-hidden="true" title="Xóa" style="cursor:pointer;" onclick=\'DeleteComment("'+ data._id +'")\'></i>\
                            </span>\
                        </p>\
                        <div>\
                            <p><b class="good">Tốt:</b> <span id="goodReview'+ data._id +'">'+ data.noi_dung_tot +'</span></p>\
                            <p><b class="bad">Góp ý:</b> <span id="badReview'+ data._id +'">'+ data.noi_dung_xau +'</span></p>\
                        </div>\
                    </div>\
                </div>';
        var frame = document.getElementById('commentFrame');
        frame.innerHTML = str + frame.innerHTML;
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function OpenUpdateComment(commentID) {
    var score = document.getElementById('score'+ commentID).innerHTML;
    var goodReview = document.getElementById('goodReview'+ commentID).innerHTML;
    var badReview = document.getElementById('badReview'+ commentID).innerHTML;
    document.getElementById('commentScore').value = score;
    document.getElementById('good-review').value = goodReview;
    document.getElementById('bad-review').value = badReview;

    document.getElementById('commentUpdating').value = commentID;
}

function UpdateComment(commentID) {
    var token = document.getElementById('token').value;
    var score = document.getElementById('commentScore').value;
    var goodReview = document.getElementById('good-review').value;
    var badReview = document.getElementById('bad-review').value;
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/api/binh_luan/member/'+ commentID,
        data: {
            noi_dung_tot: goodReview,
            noi_dung_xau: badReview,
            diem: score
        },
        headers: {
            'Authorization': 'bearer '+ token
        }
    })
    .then(function(response) {
        var data = response.data;
        document.getElementById('time'+ commentID).innerHTML = data.thoi_gian;
        document.getElementById('score'+ commentID).innerHTML = data.diem +'.0';
        document.getElementById('goodReview'+ commentID).innerHTML = data.noi_dung_tot;
        document.getElementById('badReview'+ commentID).innerHTML = data.noi_dung_xau;
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function DeleteComment(commentID) {
    if(confirm('Quý khách sẽ xóa bình luận này?')) {
        var token = document.getElementById('token').value;
        axios({
            method: 'DELETE',
            url: 'http://localhost:8000/api/binh_luan/member/'+ commentID,
            headers: {
                'Authorization': 'bearer '+ token
            }
        })
        .then(function(response) {
            document.getElementById('review'+ commentID).hidden = true;
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

function CloseCommentModal() {
    document.getElementById('good-review').value = '';
    document.getElementById('bad-review').value = '';
    document.getElementById('closeCommentModal').click();
}