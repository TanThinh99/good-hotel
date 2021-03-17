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