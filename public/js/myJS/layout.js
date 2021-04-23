function CustomerLogin(t, type) {
    var i, tabList = document.getElementsByClassName('nav-link');
    for(i=0; i<tabList.length; i++) {
        tabList[i].classList.remove('active');
    }
    var contentList = document.getElementsByClassName('tab-pane');
    for(i=0; i<contentList.length; i++) {
        contentList[i].classList.remove('active');
    }
    if(type == 'loginTabPane') {
        document.getElementById(type).classList.add('active');
    }
    else if(type == 'regTabPane'){
        document.getElementById(type).classList.add('active');
    }
    else if(type == 'forgetPasswordTabPane'){
        document.getElementById(type).classList.add('active');
    }
    else if(type == 'saveNewPasswordTabPane'){
        document.getElementById(type).classList.add('active');
    }
    t.classList.add('active');
}

function CloseModal() {
    document.getElementById('closeLoginModal').click();
}

function Register() {
    var pass1 = document.getElementById('pass1').value;
    var pass2 = document.getElementById('pass2').value;
    if((pass1 != pass2) || (pass1 == '')) {
        alert('Mật khẩu không được rỗng, mật khẩu xác nhận phải trùng khớp với mật khẩu!');
        return;
    }
    var hoTen = document.getElementById('hoTen').value;
    var sdt = document.getElementById('sdt').value;
    var email = document.getElementById('email').value;
    var username = document.getElementById('username').value;
    axios({
        method: 'POST',
        url: 'http://localhost:8000/api/tai_khoan',
        data: {
            ho_ten: hoTen,
            so_dien_thoai: sdt,
            email: email,
            username: username,
            password: pass1
        }
    })
    .then(function(response) {
        alert('Quý khách đăng ký tài khoản thành công!');
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });

    CloseModal();
}

function Login() {
    var uid = document.getElementById('uid').value;
    var pass = document.getElementById('pass').value;

    if(uid == '' || pass == '') {
        alert('Quý khách vui lòng nhập tên đăng nhập và mật khẩu!');
    }
    else {
        axios({
            method: 'POST',
            url: 'http://localhost:8000/api/postLogin',
            data: {
                uid: uid,
                pass: pass
            }
        })
        .then(function(response) {
            if(response.data.access == '0') {
                alert('Opp!! Quý khách đăng nhập thất bại!');
            }
            else {
                if(response.data.access == '') {
                    location.reload();
                }
                else {
                    window.location.href = response.data.access;
                }
            }
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

function CheckAccountInfo() {
    var uid = document.getElementById('uidFP').value;
    var email = document.getElementById('emailFP').value;
    if((uid == '') || (email == '')) {
        alert('Tên đăng nhập và email không được rỗng!');
        return;
    }
    axios({
        method: 'POST',
        url: 'http://localhost:8000/forgetPassword',
        data: {
            uid: uid,
            email: email
        }
    })
    .then(function(response) {
        var err = response.data.err;
        if(err == '') {
            var itemNav = document.getElementById('savePassNavItem');
            CustomerLogin(itemNav, 'saveNewPasswordTabPane');
            alert('Xác nhận tài khoản thành công. Hệ thống đã gửi mail đến email của quý khách!');
        }
        else {
            alert(err);
        }
    })
    .catch(function(err) {
        console.log(err);
        alert('Có lỗi hệ thống. Quý khách vui lòng thử lại sau!');
    })
}

function SaveNewPassword() {
    var token = document.getElementById('tokenFP').value.trim();
    if(token == '') {
        alert('Chuỗi mã hóa không được rỗng!');
        return;
    }
    var pass1 = document.getElementById('pass1FP').value.trim();
    var pass2 = document.getElementById('pass2FP').value.trim();
    if((pass1 == '') || (pass2 == '') || (pass1 != pass2)) {
        alert('Mật khẩu không được rỗng, và mật khẩu nhập lại phải trùng khớp với mật khẩu trên!');
        return;
    }   
    axios({
        method: 'POST',
        url: 'http://localhost:8000/confirmNewPassword',
        data: {
            token: token,
            password: pass1
        }
    })
    .then(function(response) {
        var err = response.data.err;
        if(err == '') {
            alert('Quý khách đã đổi mật khẩu thành công!');
            location.reload();
        }
        else {
            alert(err);
        }
    })
    .catch(function(err) {
        console.log(err);
        alert('Có lỗi hệ thống. Quý khách vui lòng thử lại sau!');
    })
}