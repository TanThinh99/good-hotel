window.onload = function () {
    var fileUpload = document.getElementById("fileupload");
    fileUpload.onchange = function () {
        if (typeof (FileReader) != "undefined") {
            var dvPreview = document.getElementById("dvPreview");
            dvPreview.innerHTML = "";
            var regex = /^([a-zA-Z0-9\\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
            for (var i = 0; i < fileUpload.files.length; i++) {
                var file = fileUpload.files[i];
                if (regex.test(file.name.toLowerCase())) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = document.createElement("IMG");
                        // img.height = "150";
                        img.width = "210";
                        img.src = e.target.result;
                        dvPreview.appendChild(img);
                    }
                    reader.readAsDataURL(file);
                } else {
                    alert(file.name + " is not a valid image file.");
                    dvPreview.innerHTML = "";
                    return false;
                }
            }
        } 
        else {
            alert("This browser does not support HTML5 FileReader.");
        }
    }
}

function UpdateRoomType() {
    var name = document.getElementById('name').value.trim();
    var price = document.getElementById('price').value.trim();
    var amountRoom = document.getElementById('amountRoom').value.trim();
    var displayStatus = name == '' ? 'block' : 'none';
    document.getElementById('nameInfoErr').style.display = displayStatus;
    displayStatus = price == '' ? 'block' : 'none';
    document.getElementById('priceInfoErr').style.display = displayStatus;
    displayStatus = amountRoom == '' ? 'block' : 'none';
    document.getElementById('amountRoomInfoErr').style.display = displayStatus;
    if((name == '') || (price == '') || (amountRoom == '')) {
        return;
    }

    price = parseInt(price);
    displayStatus = price < 1 ? 'block' : 'none';
    document.getElementById('priceInfoErr').style.display = displayStatus;
    amountRoom = parseInt(amountRoom);
    displayStatus = amountRoom < 1 ? 'block' : 'none';
    document.getElementById('amountRoomInfoErr').style.display = displayStatus;
    if((price < 1) || (amountRoom < 1)) {
        return;
    }

    var image360 = document.getElementById('image360').value;
    var disabledRoom = document.getElementById('notServe').checked;

    var roomTypeID = document.getElementById('roomTypeID').value;
    var token = document.getElementById('token').value;
    var csrfToken = document.getElementById('csrfToken').value;
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/api/loai_phong/'+ roomTypeID,
        data: {
            ten: name,
            gia: price,
            so_luong: amountRoom,
            hinh_anh_360: image360,
            disabled: disabledRoom
        },
        headers: {
            'Authorization': 'bearer '+ token,
            'CSRF-Token': csrfToken
        }                
    })
    .then(function(response) {
        alert('Cập nhật thành công!');
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function ShowImage(id, imageName) {
    document.getElementById('imageInBox').src = imageName;
    document.getElementById('fullScreenLink').href = imageName;
    document.getElementById('imageSelected').value = id;
    document.getElementById('imageBox').style.display = 'block';
}

function CloseImageBox() {
    document.getElementById('imageBox').style.display = 'none';
}

function UploadImage() {
    var images = document.getElementById('fileupload').files;
    if(images.length == 0) {
        alert('Bạn chưa chọn hình ảnh nào!');
    }
    else {
        var roomTypeID = document.getElementById('roomTypeID').value;
        var token = document.getElementById('token').value;
        var csrfToken = document.getElementById('csrfToken').value;
        var formData = new FormData();
        formData.append('ma_khach_san', '');
        formData.append('ma_loai_phong', roomTypeID);
        for(i=0; i<images.length; i++) {
            formData.append('files', images[i]);
        }
        axios({
            method: 'POST',
            url: 'http://localhost:8000/api/hinh_anh',
            data: formData,
            headers: {
                'Authorization': 'bearer '+ token,
                'CSRF-Token': csrfToken
            }                                  
        })
        .then(function(response) {
            alert('Tải hình ảnh thành công!')
            location.reload();
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

function DeleteImage() {
    if(confirm('Bạn sẽ xóa hình ảnh này?')) {
        var imageID = document.getElementById('imageSelected').value;
        var token = document.getElementById('token').value;
        axios({
            method: 'DELETE',
            url: 'http://localhost:8000/api/hinh_anh/'+ imageID,
            headers: {
                'Authorization': 'bearer '+ token
            }                                  
        })
        .then(function(response) {
            document.getElementById(imageID).hidden = true;
            CloseImageBox();
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