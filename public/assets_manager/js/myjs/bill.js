function ChoosePaginateItem(pageSelected) {
    var key = document.getElementById('foundByKey').value;
    axios({
        method: 'GET',
        url: 'http://localhost:8000/manager/getBillForPagination?key='+ key +'&pageSelected='+ pageSelected,
    })
    .then(function(response) {
        document.getElementById('containerBills').innerHTML = response.data.billData;
        document.getElementById('containerPagiItem').innerHTML = response.data.paginateData;
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

document.getElementById('filterBillBtn').onclick = function() {
    var key = document.getElementById('foundByKey').value;
    window.location.href = '/manager/bill?key='+ key;
}