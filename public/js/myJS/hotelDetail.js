var images = [];
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
    document.getElementById('imgMain').src = '/uploads/'+ images[pos];
}

function ChooseImage(position) {
    document.getElementById('img'+ pos).classList.remove('active');
    
    pos = position;
    document.getElementById('img'+ pos).classList.add('active');
    document.getElementById('imgMain').src = '/uploads/'+ images[pos];
}

function ChooseCarouselImage(position, imageArr) {
    var imageArr = document.getElementById(imageArr).value;
    imageArr = imageArr.substring(0, imageArr.length-1);
    imageArr = imageArr.split(' ');
    images = imageArr;
    var sliderContent = '';
    for(var i=0; i<images.length; i++) {
        sliderContent += "<img id='img"+ i +"' onclick='ChooseImage("+ i +")' src='/uploads/"+ images[i] +"' alt='"+ images[i] +"'>";
    }
    document.getElementById('containImages').innerHTML = sliderContent;
    document.getElementById('containImages').style.width = (images.length * 110) +'px';
    
    pos = position;
    document.getElementById('img'+ pos).classList.add('active');
    document.getElementById('imgMain').src = '/uploads/'+ images[pos];
    document.getElementById('imageListSlider').style.display = 'block';
}

function OpenImage360(link) {
    document.getElementById('image360Frame').src = link;
    document.getElementById('image360').style.display = 'block';
}

function ChooseRoomType(roomTypeID, maxRoom) {
    document.getElementById('roomTypeIDSelected').value = roomTypeID;
    if(maxRoom < 5) {
        document.getElementById('amountRoom').max = maxRoom;
    }    
}

function SetFromDate() {
        // FROM DATE
    var tomorrow = new Date(new Date().getTime() + (24*60*60*1000));
    var date = tomorrow.getDate();
    if(date < 10) {
        date = '0'+ date;
    }
    var month = tomorrow.getMonth() + 1;
    if(month < 10) {
        month = '0'+ month;
    }
    var year = tomorrow.getFullYear();
    document.getElementById('fromDate').min = year +'-'+ month +'-'+ date;
        // LIMIT DATE
    month = month*1 + 3;
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
        return;
    }
    ToggleLoading();
    var roomTypeID = document.getElementById('roomTypeIDSelected').value;
    axios({
        method: 'POST',
        url: '/addToBasket',
        data: {
            roomTypeID: roomTypeID,
            amountRoom: amountRoom,
            fromDate: fromDate,
            toDate: toDate
        }            
    })
    .then(function(response) {
        ToggleLoading();
        alert('Đã thêm đơn đặt phòng vào giỏ hàng!');
        document.getElementById('amountRoom').value = '';
        document.getElementById('fromDate').value = '';
        document.getElementById('toDate').value = '';
        document.getElementById('closeCheckRoom').click();

        var basketInfo = response.data.basketInfo;
        document.getElementById('amountInBasketHeader').innerHTML = basketInfo.amount;
        document.getElementById('basketPriceHeader').innerHTML = basketInfo.price +' VND';
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function SaveComment() {
    var token = document.getElementById('token').value;
    if(token == '') {
        alert('Bạn cần phải đăng nhập để tạo bình luận!');
        return;
    }
    var score = document.getElementById('commentScore').value.trim();
    var goodReview = document.getElementById('good-review').value.trim();
    var badReview = document.getElementById('bad-review').value.trim();
    var displayStatus = score == '' ? 'block' : 'none';
    document.getElementById('scoreCommentErr').style.display = displayStatus;
    displayStatus = goodReview == '' ? 'block' : 'none';
    document.getElementById('goodCommentErr').style.display = displayStatus;
    displayStatus = badReview == '' ? 'block' : 'none';
    document.getElementById('badCommentErr').style.display = displayStatus;
    if((score == '') || (goodReview == '') || (badReview == '')) {
        return;
    }
    score = parseInt(score);
    displayStatus = (score < 0) || (10 < score) ? 'block' : 'none';
    document.getElementById('scoreCommentErr').style.display = displayStatus;
    if((score < 0) || (10 < score)) {
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
    ToggleLoading();
    var token = document.getElementById('token').value;
    var score = parseInt(document.getElementById('commentScore').value.trim());
    var goodReview = document.getElementById('good-review').value.trim();
    var badReview = document.getElementById('bad-review').value.trim();
    var hotelID = document.getElementById('hotelID').value;
    axios({
        method: 'POST',
        url: '/api/binh_luan/member',
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
        ToggleLoading();
        if(response.data.err != '') {
            alert(response.data.err)
        }
        else {
            var yourName = document.getElementById('yourName').value;
            var avatar = document.getElementById('yourAvatar').value;
            var data = response.data.comment;
            var str = '<div class="review" id="review'+ data._id +'">\
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
        }
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function OpenUpdateComment(commentID) {
    var score = document.getElementById('score'+ commentID).innerHTML *1;
    var goodReview = document.getElementById('goodReview'+ commentID).innerHTML;
    var badReview = document.getElementById('badReview'+ commentID).innerHTML;
    document.getElementById('commentScore').value = score;
    document.getElementById('good-review').value = goodReview;
    document.getElementById('bad-review').value = badReview;

    document.getElementById('commentUpdating').value = commentID;
}

function UpdateComment(commentID) {
    ToggleLoading();
    var token = document.getElementById('token').value;
    var score = parseInt(document.getElementById('commentScore').value.trim());
    var goodReview = document.getElementById('good-review').value.trim();
    var badReview = document.getElementById('bad-review').value.trim();
    axios({
        method: 'PUT',
        url: '/api/binh_luan/member/'+ commentID,
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
        ToggleLoading();
        var data = response.data;
        document.getElementById('time'+ commentID).innerHTML = data.thoi_gian;
        document.getElementById('score'+ commentID).innerHTML = data.diem +'.0';
        document.getElementById('goodReview'+ commentID).innerHTML = data.noi_dung_tot;
        document.getElementById('badReview'+ commentID).innerHTML = data.noi_dung_xau;
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function DeleteComment(commentID) {
    if(confirm('Quý khách sẽ xóa bình luận này?')) {
        var token = document.getElementById('token').value;
        ToggleLoading();
        axios({
            method: 'DELETE',
            url: '/api/binh_luan/member/'+ commentID,
            headers: {
                'Authorization': 'bearer '+ token
            }
        })
        .then(function(response) {
            ToggleLoading();
            document.getElementById('review'+ commentID).hidden = true;
        })
        .catch(function(err) {
            ToggleLoading();
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

function CloseCommentModal() {
    document.getElementById('commentScore').value = 8;
    document.getElementById('good-review').value = '';
    document.getElementById('bad-review').value = '';
    document.getElementById('closeCommentModal').click();
}

document.getElementById('closeTopCommentModal').onclick = function() {
    document.getElementById('commentScore').value = 8;
    document.getElementById('good-review').value = '';
    document.getElementById('bad-review').value = '';
}

function ChoosePaginateItem(pageSelected) {
    ToggleLoading();
    var hotelID = document.getElementById('hotelID').value;
    axios({
        method: 'GET',
        url: '/getCommentHotelForPagination?hotelID='+ hotelID +'&pageSelected='+ pageSelected,
    })
    .then(function(response) {
        ToggleLoading();
        document.getElementById('commentFrame').innerHTML = response.data.commentData;
        document.getElementById('containerPagiItem').innerHTML = response.data.paginateData;
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}