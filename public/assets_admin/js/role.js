function AddRole() {
    var ten = document.getElementById('roleName').value;
    var token = document.getElementById('token').value;
    axios({
        method: 'POST',
        url: 'http://localhost:8000/api/vai_tro',
        data: {
            ten: ten
        }, 
        headers: {
            'Authorization': 'bearer '+ token
        }
    })
    .then(function(response) {
        alert('Thêm vai trò thành công!');
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function UpdateRole() {
    var token = document.getElementById('token').value;
    var roleID = document.getElementById('roleID').value;
    var ten = document.getElementById('roleName').value;
    var roleStatus = document.getElementById('roleStatus').checked;
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/api/vai_tro/'+ roleID,
        data: {
            ten: ten,
            disabled: roleStatus
        }, 
        headers: {
            'Authorization': 'bearer '+ token
        }
    })
    .then(function(response) {
        alert('Cập nhật vai trò thành công!');
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function DeleteRole(roleID) {
    if(confirm('Bạn sẽ xóa vai trò này?(Nếu có tài khoản có vai trò này, thì sẽ vô hiệu hóa vai trò. Ngược lại sẽ xóa vai trò.)')) {
        var token = document.getElementById('token').value;
        axios({
            method: 'DELETE',
            url: 'http://localhost:8000/api/vai_tro/'+ roleID,
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

function DestroyPermission(allowID) {
    if(confirm('Bạn sẽ xóa quyền này khỏi vai trò này?')) {
        var token = document.getElementById('token').value;
        axios({
            method: 'DELETE',
            url: 'http://localhost:8000/api/vai_tro_co_quyen/'+ allowID,
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

function GrantPermission() {
    var permissID = document.getElementById('permissSelected').value;
    if(permissID == '') {
        alert('Bạn cần chọn một quyền trước khi thêm vào!');
        return;
    }
    if(confirm('Bạn sẽ cấp quyền này cho vai trò này?')) {
        var roleID = document.getElementById('roleID').value;
        var token = document.getElementById('token').value;
        axios({
            method: 'POST',
            url: 'http://localhost:8000/api/vai_tro_co_quyen',
            data: {
                ma_vai_tro: roleID,
                ma_quyen: permissID
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
}

function ChoosePermission(permissID) {
    var permissSelected = document.getElementById('permissSelected').value;
    if(permissSelected != '') {
        document.getElementById('permiss'+ permissSelected).classList.remove('active');
    }
    document.getElementById('permissSelected').value = permissID;
    document.getElementById('permiss'+ permissID).classList.add('active');
}