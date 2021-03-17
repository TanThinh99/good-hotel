function ChooseControl(self, typeContent) {
    var navList = document.getElementsByClassName('infoNav');
    for (var i = 0; i < navList.length; i++) {
        navList[i].classList.remove('active-nav');
    }

    var contentList = document.getElementsByClassName('mainContent');
    for (var i = 0; i < contentList.length; i++) {
        contentList[i].style.display = 'none';
    }
    if(typeContent != '') {
        document.getElementById(typeContent).style.display = 'block';
    }
    else {
        alert('dang xuat nhe');
    }                
    self.classList.add('active-nav');
}

document.getElementById('avatar').onchange = function(event) {
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
    var file = event.target.files[0];
    if (regex.test(file.name.toLowerCase())) {
        var reader = new FileReader();
        reader.onload = function(){
        var avatarImg = document.getElementById('avatarImg');
        avatarImg.src = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    } 
    else {
        alert(file.name + " is not a valid image file.");
        document.getElementById('avatarImg').src = "";
    }
};