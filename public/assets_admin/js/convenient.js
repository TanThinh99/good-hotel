function ChooseIcon(name) {
    var iconSelected = document.getElementById('iconSelected').value;
    if(iconSelected != '') {
        document.getElementById('icon'+ iconSelected).classList.remove('active');
    }
    document.getElementById('iconSelected').value = name;
    document.getElementById('icon'+ name).classList.add('active');
}

function CreateConvenient() {
    var name = document.getElementById('convenName').value.trim();
    var icon = document.getElementById('iconSelected').value;
    var displayStatus = name == '' ? 'block' : 'none';
    document.getElementById('nameInfoErr').style.display = displayStatus;
    displayStatus = icon == '' ? 'block' : 'none';
    document.getElementById('iconErr').style.display = displayStatus;
    if((name == '') || (icon == '')) {
        return;
    }
    var token = document.getElementById('token').value;
    ToggleLoading();
    axios({
        method: 'POST',
        url: '/api/tien_nghi',
        data: {
            ten: name,
            hinh_anh: icon
        },
        headers: {
            'Authorization': 'bearer '+ token
        }                
    })
    .then(function(response) {
        ToggleLoading();
        alert('Thêm mới tiện nghi thành công!');
        window.location.href = '/admin/convenient';
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function UpdateConvenient() {
    var name = document.getElementById('convenName').value.trim();
    var displayStatus = name == '' ? 'block' : 'none';
    document.getElementById('nameInfoErr').style.display = displayStatus;
    if(name == '') {
        return;
    }
    var convenID = document.getElementById('convenID').value;
    var icon = document.getElementById('iconSelected').value;
    var token = document.getElementById('token').value;
    ToggleLoading();
    axios({
        method: 'PUT',
        url: '/api/tien_nghi/'+ convenID,
        data: {
            ten: name,
            hinh_anh: icon
        },
        headers: {
            'Authorization': 'bearer '+ token
        }                
    })
    .then(function(response) {
        ToggleLoading();
        alert('Cập nhật tiện nghi thành công!');
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function DeleteConvenient(convenID) {
    if(confirm('Bạn sẽ xóa tiện nghi này?')) {
        var token = document.getElementById('token').value;
        ToggleLoading();
        axios({
            method: 'DELETE',
            url: '/api/tien_nghi/'+ convenID,
            headers: {
                'Authorization': 'bearer '+ token
            }                
        })
        .then(function(response) {
            ToggleLoading();
            document.getElementById('div'+ convenID).hidden = true;
        })
        .catch(function(err) {
            ToggleLoading();
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}