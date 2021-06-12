function AddRole() {
    var ten = document.getElementById('roleName').value.trim();
    var displayStatus = ten == '' ? 'block' : 'none';
    document.getElementById('nameRoleErr').style.display = displayStatus;
    if(ten == '') {
        return;
    }
    var token = document.getElementById('token').value;
    ToggleLoading();
    axios({
        method: 'POST',
        url: '/api/vai_tro',
        data: {
            ten: ten
        }, 
        headers: {
            'Authorization': 'bearer '+ token
        }
    })
    .then(function(response) {
        ToggleLoading();
        alert('Thêm vai trò thành công!');
        window.location.href = '/admin/role';
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function UpdateRole() {
    var ten = document.getElementById('roleName').value.trim();
    var displayStatus = ten == '' ? 'block' : 'none';
    document.getElementById('nameRoleErr').style.display = displayStatus;
    if(ten == '') {
        return;
    }
    var token = document.getElementById('token').value;
    var roleID = document.getElementById('roleID').value;
    var roleStatus = document.getElementById('roleStatus').checked;
    ToggleLoading();
    axios({
        method: 'PUT',
        url: '/api/vai_tro/'+ roleID,
        data: {
            ten: ten,
            disabled: roleStatus
        }, 
        headers: {
            'Authorization': 'bearer '+ token
        }
    })
    .then(function(response) {
        ToggleLoading();
        alert('Cập nhật vai trò thành công!');
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function DeleteRole(roleID) {
    if(confirm('Bạn sẽ xóa vai trò này?(Nếu có tài khoản có vai trò này, thì sẽ vô hiệu hóa vai trò. Ngược lại sẽ xóa vai trò.)')) {
        var token = document.getElementById('token').value;
        ToggleLoading();
        axios({
            method: 'DELETE',
            url: '/api/vai_tro/'+ roleID,
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

function DestroyPermission(allowID) {
    if(confirm('Bạn sẽ xóa quyền này khỏi vai trò này?')) {
        var token = document.getElementById('token').value;
        ToggleLoading();
        axios({
            method: 'DELETE',
            url: '/api/vai_tro_co_quyen/'+ allowID,
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

function GrantPermission() {
    var permissID = document.getElementById('permissSelected').value;
    if(permissID == '') {
        alert('Bạn cần chọn một quyền trước khi thêm vào!');
        return;
    }
    if(confirm('Bạn sẽ cấp quyền này cho vai trò này?')) {
        var roleID = document.getElementById('roleID').value;
        var token = document.getElementById('token').value;
        ToggleLoading();
        axios({
            method: 'POST',
            url: '/api/vai_tro_co_quyen',
            data: {
                ma_vai_tro: roleID,
                ma_quyen: permissID
            },
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

function ChoosePermission(permissID) {
    var permissSelected = document.getElementById('permissSelected').value;
    if(permissSelected != '') {
        document.getElementById('permiss'+ permissSelected).classList.remove('active');
    }
    document.getElementById('permissSelected').value = permissID;
    document.getElementById('permiss'+ permissID).classList.add('active');
}