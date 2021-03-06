function ShowImage(roomID, imageID, imageName) {
    document.getElementById('imageInBox'+ roomID).src = imageName;
    document.getElementById('fullScreen'+ roomID).href = imageName;
    document.getElementById('imageSelected'+ roomID).value = imageID;
    document.getElementById('box'+ roomID).style.display = 'block';
}

function CloseImageBox(roomID) {
    document.getElementById('box'+ roomID).style.display = 'none';
}

function DeleteImage(roomID) {
    if(confirm('Bạn sẽ xóa hình ảnh này?')) {
        var imageID = document.getElementById('imageSelected'+ roomID).value;
        var token = document.getElementById('token').value;
        ToggleLoading();
        axios({
            method: 'DELETE',
            url: '/api/hinh_anh/'+ imageID,
            headers: {
                'Authorization': 'bearer '+ token
            }                                  
        })
        .then(function(response) {
            ToggleLoading();
            document.getElementById(imageID).hidden = true;
            CloseImageBox(roomID);
            return true;
        })
        .catch(function(err) {
            ToggleLoading();
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });                
    }
}

function DeleteRoomType(roomID) {
    if(confirm('Bạn sẽ xóa loại phòng này? (Loại phòng này sẽ bị vô hiệu hóa nếu đã từng có khách đặt loại phòng này, ngược lại thì bị xóa hoàn toàn.)')) {
        var token = document.getElementById('token').value;
        ToggleLoading();
        axios({
            method: 'DELETE',
            url: '/api/loai_phong/'+ roomID,
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