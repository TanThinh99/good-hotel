function ChoosePaginateItem(pageSelected) {
    axios({
        method: 'GET',
        url: 'http://localhost:8000/manager/getBillForPagination?pageSelected='+ pageSelected,
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