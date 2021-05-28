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
                    alert(file.name + " là hình ảnh không hợp lệ. Tên hình không được có khoảng trắng hoặc ký tự đặc biệt!");
                    dvPreview.innerHTML = "";
                    document.getElementById('fileupload').value = '';
                    document.getElementById('dvPreview').value = '';
                    break;
                }
            }
        } 
        else {
            alert("This browser does not support HTML5 FileReader.");
        }
    }
}

function ToggleSelect(id) {
    var obj = document.getElementById(id);
    if(obj.style.display == 'flex') {
        obj.style.display = 'none';
    }
    else {
        obj.style.display = 'flex';
    }
}

function ChooseCity(id, name) {
    document.getElementById('selectCityContent').style.display = 'none';
    document.getElementById('cityMain').innerHTML = name;

    // Check active class
    var cityChosenID = document.getElementById('cityChosen').value;
    if(cityChosenID != '') {
        document.getElementById('city'+ cityChosenID).classList.remove('active');
    }            

    document.getElementById('city'+ id).classList.add('active');
    document.getElementById('cityChosen').value = id;

    DistrictAjax(id);
}

function DistrictAjax(cityID) {
    axios({
        method: 'GET',
        url: 'http://localhost:8000/district_of_city/'+ cityID
    })
    .then(function(response) {
        document.getElementById('containDistContent').innerHTML = response.data.distStr;
        WardAjax(response.data.firstDistID);
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function ChooseDist(id, name) {
    document.getElementById('selectDistContent').style.display = 'none';
    document.getElementById('distMain').innerHTML = name;

    // Check active class
    var distChosenID = document.getElementById('distChosen').value;
    document.getElementById('dist'+ distChosenID).classList.remove('active');

    document.getElementById('dist'+ id).classList.add('active');
    document.getElementById('distChosen').value = id;

    WardAjax(id);
}

function WardAjax(distID) {
    axios({
        method: 'GET',
        url: 'http://localhost:8000/wards_of_district/'+ distID
    })
    .then(function(response) {
        document.getElementById('containWardContent').innerHTML = response.data;
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function ChooseWard(id, name) {
    document.getElementById('selectWardContent').style.display = 'none';
    document.getElementById('wardMain').innerHTML = name;

    // Check active class
    var wardChosenID = document.getElementById('wardChosen').value;
    document.getElementById('ward'+ wardChosenID).classList.remove('active');

    document.getElementById('ward'+ id).classList.add('active');
    document.getElementById('wardChosen').value = id;
}

function UpdateHotel() {
    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var displayStatus = name == '' ? 'block' : 'none';
    document.getElementById('nameInfoErr').style.display = displayStatus;
    displayStatus = /^\d{10,11}$/.test(phone) ? 'none' : 'block';
    document.getElementById('phoneInfoErr').style.display = displayStatus;
    if((name == '') || !(/^\d{10,11}$/.test(phone))) {
        return;
    }

    var wardID = document.getElementById('wardChosen').value;
    var address = '';
    if(wardID != '') {
        // Save address
        var wardName = document.getElementById('wardMain').innerHTML;
        var distName = document.getElementById('distMain').innerHTML;
        var cityName = document.getElementById('cityMain').innerHTML;
        var streetName = document.getElementById('streetName').value;
        streetName = streetName==''?'':streetName+', ';
        address = streetName + wardName +', '+ distName +', '+ cityName;
    }
    var googleMap = document.getElementById('googleMap').value;

    var hotelID = document.getElementById('hotelID').value;
    var token = document.getElementById('token').value;
    var csrfToken = document.getElementById('csrfToken').value;
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/api/khach_san/'+ hotelID,
        data: {
            ten: name,
            dia_chi: address,
            so_dien_thoai: phone,
            google_map: googleMap,
            maxp: wardID
        },
        headers: {
            'Authorization': 'bearer '+ token,
            'CSRF-Token': csrfToken
        }                
    })
    .then(function(response) {
        alert('Cập nhật xong thông tin khách sạn!')
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
        var ma_khach_san = document.getElementById('hotelID').value;
        var token = document.getElementById('token').value;
        var csrfToken = document.getElementById('csrfToken').value;
        var formData = new FormData();
        formData.append('ma_khach_san', ma_khach_san);
        formData.append('ma_loai_phong', '');
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