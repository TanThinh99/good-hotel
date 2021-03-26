function ChooseIcon(name) {
    var iconSelected = document.getElementById('iconSelected').value;
    if(iconSelected != '') {
        document.getElementById('icon'+ iconSelected).classList.remove('active');
    }
    document.getElementById('iconSelected').value = name;
    document.getElementById('icon'+ name).classList.add('active');
}

function CreateConvenient() {
    var name = document.getElementById('convenName').value;
    var icon = document.getElementById('iconSelected').value;
    var token = document.getElementById('token').value;
    axios({
        method: 'POST',
        url: 'http://localhost:8000/api/tien_nghi',
        data: {
            ten: name,
            hinh_anh: icon
        },
        headers: {
            'Authorization': 'bearer '+ token
        }                
    })
    .then(function(response) {
        console.log(response);
        alert('Tao tien nghi thanh cong!');
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function UpdateConvenient() {
    var convenID = document.getElementById('convenID').value;
    var name = document.getElementById('convenName').value;
    var icon = document.getElementById('iconSelected').value;
    var token = document.getElementById('token').value;
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/api/tien_nghi/'+ convenID,
        data: {
            ten: name,
            hinh_anh: icon
        },
        headers: {
            'Authorization': 'bearer '+ token
        }                
    })
    .then(function(response) {
        console.log(response);
        alert('Cap nhat tien nghi thanh cong!');
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function DeleteConvenient(convenID) {
    if(confirm('Bạn sẽ xóa tiện nghi này?')) {
        var token = document.getElementById('token').value;
        axios({
            method: 'DELETE',
            url: 'http://localhost:8000/api/tien_nghi/'+ convenID,
            headers: {
                'Authorization': 'bearer '+ token
            }                
        })
        .then(function(response) {
            console.log(response);
            document.getElementById('div'+ convenID).hidden = true;
            return true;
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
    else {
        return false;
    }
}