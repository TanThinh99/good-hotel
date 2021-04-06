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
    else {
        document.getElementById(type).classList.add('active');
    }
    t.classList.add('active');
}

function CloseModal() {
    document.getElementById('closeLoginModal').click();
}

function Register() {
    var hoTen = document.getElementById('hoTen').value;
    var sdt = document.getElementById('sdt').value;
    var email = document.getElementById('email').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('pass1').value;

    axios({
        method: 'POST',
        url: 'http://localhost:8000/api/tai_khoan',
        data: {
            ho_ten: hoTen,
            so_dien_thoai: sdt,
            email: email,
            username: username,
            password: password
        }
    })
    .then(function(response ) {
        alert('Quý khách đăng ký tài khoản thành công!');
        console.log(response);
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