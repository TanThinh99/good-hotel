function DestroyBill(billID) {
    if(confirm('Bạn sẽ hủy đơn đặt phòng này?')) {
        ToggleLoading();
        axios({
            method: 'DELETE',
            url: '/manager/destroyBill',
            data: {
                billID: billID
            }
        })
        .then(function(response) {
            ToggleLoading();
            document.getElementById('bill'+ billID).hidden = true;
        })
        .catch(function(err) {
            ToggleLoading();
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

function PaidBill(billID) {
    if(confirm('Khách hàng đã thanh toán cho đơn đặt phòng này?')) {
        ToggleLoading();
        axios({
            method: 'PUT',
            url: '/manager/paidBill',
            data: {
                billID: billID
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

function ReturnRoom(billID) {
    if(confirm('Các phòng của hóa đơn này được trả lại?')) {
        ToggleLoading();
        axios({
            method: 'PUT',
            url: '/manager/returnRoom',
            data: {
                billID: billID
            }
        })
        .then(function(response) {
            ToggleLoading();
            document.getElementById('bill'+ billID).hidden = true;
        })
        .catch(function(err) {
            ToggleLoading();
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

document.getElementById('filterBillBtn').onclick = function() {
    var key = document.getElementById('foundByKey').value;
    window.location.href = '/manager/checkRoom?key='+ key;
}