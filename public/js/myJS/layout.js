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

function ShowMoney(money) {
    money = money +'';
    if(money.length <= 3) {
        return money;
    }   
    else {
        var newMoney = '';
        while(money.length > 3) {
            var temp = money.substring(money.length-3);
            newMoney = '.'+ temp + newMoney;
            money = money.substring(0, money.length-3);
        }
        newMoney = money + newMoney;
        return newMoney;
    }
}

function CloseModal() {
    document.getElementById('closeLoginModal').click();
}

function ToggleLoading() {
    var loadingDiv = document.getElementById('loadingDiv');
    if(loadingDiv.style.display == 'block') {
        loadingDiv.style.display = 'none';
    }
    else {
        loadingDiv.style.display = 'block';
    }
}

function Register() {
    var hoTen = document.getElementById('hoTen').value.trim();
    var sdt = document.getElementById('sdt').value.trim();
    var email = document.getElementById('email').value.trim();
    var username = document.getElementById('username').value.trim();
    var pass1 = document.getElementById('pass1').value;
    var pass2 = document.getElementById('pass2').value;
    var displayStatus = '';

    displayStatus = hoTen == '' ? 'block' : 'none';
    document.getElementById('nameRegErr').style.display = displayStatus;
    displayStatus = /^\d{10,11}$/.test(sdt) ? 'none' : 'block';
    document.getElementById('phoneInvalidRegErr').style.display = displayStatus;
    displayStatus = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email) ? 'none' : 'block';
    document.getElementById('emailInvalidRegErr').style.display = displayStatus;
    displayStatus = username == '' ? 'block' : 'none';
    document.getElementById('uidRegErr').style.display = displayStatus;
    displayStatus = pass1 == '' ? 'block' : 'none';
    document.getElementById('passRegErr').style.display = displayStatus;
    displayStatus = pass1 != pass2 ? 'block' : 'none';
    document.getElementById('passAgainRegErr').style.display = displayStatus;
    if((hoTen == '') || !(/^\d{10,11}$/.test(sdt)) || !(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email)) || (username == '') || (pass1 == '') || (pass1 != pass2)) {
        return;
    }
    ToggleLoading();
    axios({
        method: 'POST',
        url: '/api/tai_khoan',
        data: {
            ho_ten: hoTen,
            so_dien_thoai: sdt,
            email: email,
            username: username,
            password: pass1
        }
    })
    .then(function(response) {
        ToggleLoading();
        if(response.data == 'success') {
            alert('Quý khách đăng ký tài khoản thành công!');
            location.reload();
        }
        else {
            alert('Tên đăng nhập này đã tồn tại!');
        }
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function Login() {
    var uid = document.getElementById('uid').value.trim();
    var pass = document.getElementById('pass').value;
    var displayStatus = '';

    displayStatus = uid == '' ? 'block' : 'none';
    document.getElementById('uidLoginErr').style.display = displayStatus;
    displayStatus = pass == '' ? 'block' : 'none';
    document.getElementById('passLoginErr').style.display = displayStatus;
    if(uid == '' || pass == '') {
        return;
    }
    else {
        ToggleLoading();
        axios({
            method: 'POST',
            url: '/api/postLogin',
            data: {
                uid: uid,
                pass: pass
            }
        })
        .then(function(response) {
            ToggleLoading();
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
            ToggleLoading();
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
    ToggleLoading();
    axios({
        method: 'POST',
        url: '/forgetPassword',
        data: {
            uid: uid,
            email: email
        }
    })
    .then(function(response) {
        ToggleLoading();
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
        ToggleLoading();
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
    ToggleLoading();
    axios({
        method: 'POST',
        url: '/confirmNewPassword',
        data: {
            token: token,
            password: pass1
        }
    })
    .then(function(response) {
        ToggleLoading();
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
        ToggleLoading();
        console.log(err);
        alert('Có lỗi hệ thống. Quý khách vui lòng thử lại sau!');
    })
}