function DeleteItem(itemID) {
    if(confirm('Bạn sẽ xóa đơn đặt phòng này?')) {
        axios({
            method: 'DELETE',
            url: 'http://localhost:8000/deleteInBasket',
            data: {
                itemID: itemID
            }            
        })
        .then(function(response) {
            document.getElementById('item'+ itemID).hidden = true;

            // Update basket price total
            var oldItemTotal = document.getElementById('itemTotalHidden'+ itemID).value * 1;
            var basketTotal = document.getElementById('basketTotalHidden').value * 1;
            basketTotal -= oldItemTotal;
            document.getElementById('basketTotalHidden').value = basketTotal;
            
            basketTotal = ShowMoney(basketTotal);
            document.getElementById('basketTotal').innerHTML = basketTotal;
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });                
    }
}

function ChangeFromDate(itemID) {
    var fromDate = document.getElementById('fromDate'+ itemID);
    var toDate = document.getElementById('toDate'+ itemID);
    toDate.min = fromDate.value;
    if(fromDate.value > toDate.value) {
        toDate.value = fromDate.value;
    }
    UpdateItem(itemID);
}

function UpdateItem(itemID) {
    var amountRoom = document.getElementById('amountRoom'+ itemID).value;
    var fromDate = document.getElementById('fromDate'+ itemID).value;
    var toDate = document.getElementById('toDate'+ itemID).value;
    var d1 = new Date(fromDate);
    var d2 = new Date(toDate);
    var amountDate = (d2-d1)/(24 * 3600 * 1000);
    axios({
        method: 'PUT',
        url: 'http://localhost:8000/updateInBasket',
        data: {
            itemID: itemID,
            amountRoom: amountRoom,
            fromDate: fromDate,
            toDate: toDate,
            amountDate: amountDate
        }            
    })
    .then(function(response) {
        UpdatePrice(itemID, amountDate, amountRoom);
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });                
}

function UpdatePrice(itemID, amountDate, amountRoom) {
    var price = document.getElementById('price'+ itemID).value * 1;
    var oldItemTotal = document.getElementById('itemTotalHidden'+ itemID).value * 1;
    var total = (amountDate*1) * (amountRoom*1) * price;
    document.getElementById('itemTotalHidden'+ itemID).value = total;

    var basketTotal = document.getElementById('basketTotalHidden').value * 1;
    basketTotal -= oldItemTotal;
    basketTotal += total
    document.getElementById('basketTotalHidden').value = basketTotal;
    
    total = ShowMoney(total);
    document.getElementById('itemTotal'+ itemID).innerHTML = total;
    basketTotal = ShowMoney(basketTotal);
    document.getElementById('basketTotal').innerHTML = basketTotal;
}

function CreateBill() {
    var basketPrice = document.getElementById('basketTotalHidden').value;
    if(basketPrice == '0') {
        alert('Giỏ hàng quý khách đang rỗng, không thể tạo đơn đặt phòng!');
        return;
    }
    var token = document.getElementById('token').value;
    if(token == '') {
        alert('Quý khách vui lòng đăng nhập để có thể tạo đơn đặt phòng');
        return;
    }
    axios({
        method: 'POST',
        url: 'http://localhost:8000/api/hoa_don',
        headers: {
            'Authorization': 'bearer '+ token
        }            
    })
    .then(function(response) {
        alert('Cảm ơn quý khách đã đặt phòng trên website ^^');
        location.reload();
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });            
}