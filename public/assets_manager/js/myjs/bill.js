function ChoosePaginateItem(pageSelected) {
    var key = document.getElementById('foundByKey').value;
    ToggleLoading();
    axios({
        method: 'GET',
        url: '/manager/getBillForPagination?key='+ key +'&pageSelected='+ pageSelected,
    })
    .then(function(response) {
        ToggleLoading();
        document.getElementById('containerBills').innerHTML = response.data.billData;
        document.getElementById('containerPagiItem').innerHTML = response.data.paginateData;
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

document.getElementById('filterBillBtn').onclick = function() {
    var key = document.getElementById('foundByKey').value;
    window.location.href = '/manager/bill?key='+ key;
}