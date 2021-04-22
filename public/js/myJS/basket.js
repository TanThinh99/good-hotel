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

            var basketInfo = response.data.basketInfo;
            document.getElementById('amountInBasketHeader').innerHTML = basketInfo.amount;
            document.getElementById('basketPriceHeader').innerHTML = basketInfo.price +' VND';
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });                
    }
}

function SetFromDate() {
    // FROM DATE
    var tomorrow = new Date(new Date().getTime() + (24*60*60*1000));
    var date = tomorrow.getDate();
    if(date < 10) {
        date = '0'+ date;
    }
    var month = tomorrow.getMonth() + 1;
    if(month < 10) {
        month = '0'+ month;
    }
    var year = tomorrow.getFullYear();
    var minDate = year +'-'+ month +'-'+ date;
        // LIMIT DATE
    month = month*1 + 3;
    if(month > 12) {
        month = month - 12;
        year++;
    }
    var limitDate = new Date(year +'-'+ month +'-'+ date);
    month = limitDate.getMonth();
    if(month < 10) {
        month = '0'+ month;
    }
    date = limitDate.getDate();
    if(date < 10) {
        date = '0'+ date;
    }
    var maxDate = year +'-'+ month +'-'+ date;
    var fromDateList = document.getElementsByClassName('fromDate');
    for(var i=0; i<fromDateList.length; i++) {
        fromDateList[i].min = minDate;
        fromDateList[i].max = maxDate;
    }
}

SetFromDate();

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
    amountDate = amountDate == 0 ? 1: amountDate;
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
        var basketInfo = response.data.basketInfo;
        document.getElementById('amountInBasketHeader').innerHTML = basketInfo.amount;
        document.getElementById('basketPriceHeader').innerHTML = basketInfo.price +' VND';

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