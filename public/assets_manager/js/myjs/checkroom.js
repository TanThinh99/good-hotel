function DestroyBill(billID) {
    if(confirm('Bạn sẽ hủy đơn đặt phòng này?')) {
        axios({
            method: 'DELETE',
            url: 'http://localhost:8000/manager/destroyBill',
            data: {
                billID: billID
            }
        })
        .then(function(response) {
            document.getElementById('bill'+ billID).hidden = true;
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

function PaidBill(billID) {
    if(confirm('Khách hàng đã thanh toán cho đơn đặt phòng này?')) {
        axios({
            method: 'PUT',
            url: 'http://localhost:8000/manager/paidBill',
            data: {
                billID: billID
            }
        })
        .then(function(response) {
            location.reload();
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

function ReturnRoom(billID) {
    if(confirm('Các phòng của hóa đơn này được trả lại?')) {
        axios({
            method: 'PUT',
            url: 'http://localhost:8000/manager/returnRoom',
            data: {
                billID: billID
            }
        })
        .then(function(response) {
            document.getElementById('bill'+ billID).hidden = true;
        })
        .catch(function(err) {
            alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
            console.log(err);
        });
    }
}

document.getElementById('filterBillBtn').onclick = function() {
    var key = document.getElementById('foundByKey').value;
    window.location.href = '/manager/checkRoom?key='+ key;
}