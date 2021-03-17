var images = [];
images[0] = 'https://noithatamber.vn/images/uploaded/ph%C3%B2ng%20ng%E1%BB%A7%202.jpg';
images[1] = 'https://lh3.googleusercontent.com/proxy/1KNaPxJGDd6XEV4ld80qi5oz3Dgsjli7VtxFSN3fiM1-zvY-s674JJytGS_xZRbTzaKwuhkQqF9WmOhu6aqRbF_Y0cHrgSFz6RV71pkMTAfe_9_GBOMcgOaoIXW70oGZbn_S0FSRVjaaggKoPwiauUuWDfbWAA';
images[2] = 'https://wedo.vn/wp-content/uploads/2019/07/thiet-ke-phong-ngu-15m2-12.jpg';
images[3] = 'https://wedo.vn/wp-content/uploads/2018/08/thiet-ke-noi-that-phong-ngu-15m2-dep-4.jpg';
images[4] = 'https://xuongnoithatdep.com/upload/images/combo-noi-that-phong-ngu-2.png';
images[5] = 'https://afamilycdn.com/150157425591193600/2020/5/25/7-15903740976832059393369-63-0-1001-1500-crop-1590374332746174200395.jpg';

var pos = 0;
function TurnImage(direction) {
    document.getElementById('img'+ pos).classList.remove('active');
    if( direction == 'left') {
        if(pos == 0) {
            pos = images.length - 1;
        }
        else {
            pos--;
        }
    }
    else if( direction == 'right') {
        if(pos == (images.length - 1)) {
            pos = 0;
        }
        else {
            pos++;
        }
    }
    document.getElementById('img'+ pos).classList.add('active');
    document.getElementById('imgMain').src = images[pos];
}

function ChooseImage(position) {
    document.getElementById('img'+ pos).classList.remove('active');
    
    pos = position;
    document.getElementById('img'+ pos).classList.add('active');
    document.getElementById('imgMain').src = images[pos];
}

function ChooseCarouselImage(position) {
    document.getElementById('img'+ pos).classList.remove('active');
    
    pos = position;
    document.getElementById('img'+ pos).classList.add('active');
    document.getElementById('imgMain').src = images[pos];

    document.getElementById('imageListSlider').style.display = 'block';
}