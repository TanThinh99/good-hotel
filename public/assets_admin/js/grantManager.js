document.getElementById('findHotelBtn').onclick = function() {
    var key = document.getElementById('hotelKey').value;
    axios({
        method: 'GET',
        url: 'http://localhost:8000/admin/findHotelByKey?key='+ key,
    })
    .then(function(response) {
        document.getElementById('containerHotels').innerHTML = response.data.hotelData;
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

document.getElementById('findManagerBtn').onclick = function() {
    var key = document.getElementById('managerKey').value;
    axios({
        method: 'GET',
        url: 'http://localhost:8000/admin/findManagerByKey?key='+ key,
    })
    .then(function(response) {
        document.getElementById('containerManager').innerHTML = response.data.managerData;
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

function ChooseItemGrant(type, itemID) {
    if(type == 'hotel') {
        var hotelChosen = document.getElementById('hotelChosen').value;
        var hotel = document.getElementById('hotel'+ hotelChosen);
        if(hotel != undefined) {
            hotel.classList.remove('active');
        }
        document.getElementById('hotelChosen').value = itemID;
        document.getElementById('hotel'+ itemID).classList.add('active');
    }
    else if(type == 'manager') {
        var managerChosen = document.getElementById('managerChosen').value;
        var manager = document.getElementById('manager'+ managerChosen);
        if(manager != undefined) {
            manager.classList.remove('active');
        }
        document.getElementById('managerChosen').value = itemID;
        document.getElementById('manager'+ itemID).classList.add('active');
    }
}

document.getElementById('grantManagerBtn').onclick = function() {
    var hotelID = document.getElementById('hotelChosen').value;
    var managerID = document.getElementById('managerChosen').value;
    if((hotelID == '') || (managerID == '')) {
        alert('Để cấp quyền quản lý, bạn cần chọn một khách sạn và một quản lý!');
        return;
    }
    var token = document.getElementById('token').value;
    axios({
        method: 'POST',
        url: 'http://localhost:8000/api/tai_khoan/grantManager',
        data: {
            hotelID: hotelID,
            managerID: managerID
        },
        headers: {
            'Authorization': 'bearer '+ token
        }
    })
    .then(function(response) {
        alert('Cấp quyền quản lý khách sạn thành công!');
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}