function DestroyConvenient(convenID) {
    if(confirm('Bạn sẽ xóa tiện nghi này ra khỏi khách sạn?')) {
        var token = document.getElementById('token').value;
        axios({
            method: 'DELETE',
            url: 'http://localhost:8000/api/tien_nghi_ks/'+ convenID,
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
}

function AddConvenient() {
    var convenID = document.getElementById('convenSelected').value;
    if(convenID == '') {
        alert('Bạn cần chọn một tiện nghi nào đó trước!');
        return;
    }
    var token = document.getElementById('token').value;
    var hotelID = document.getElementById('hotelID').value;
    axios({
        method: 'POST',
        url: 'http://localhost:8000/api/tien_nghi_ks',
        data: {
            ma_tien_nghi: convenID,
            ma_khach_san: hotelID
        },
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

function ChooseConvenient(convenID) {
    var convenSelected = document.getElementById('convenSelected').value;
    if(convenSelected != '') {
        document.getElementById('conven'+ convenSelected).classList.remove('active');
    }
    document.getElementById('convenSelected').value = convenID;
    document.getElementById('conven'+ convenID).classList.add('active');
}