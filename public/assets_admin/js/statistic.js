function Statistic() {
    var fromDate = document.getElementById('fromDate').value;
    var toDate = document.getElementById('toDate').value;
    var contentKey = document.getElementById('contentKey').value.trim();
    ToggleLoading();
    axios({
        method: 'POST',
        url: '/admin/statistic',
        data: {
            fromDate: fromDate,
            toDate: toDate,
            contentKey: contentKey
        }             
    })
    .then(function(response) {
        ToggleLoading();
        var data = response.data;
        document.getElementById('statisticContent').innerHTML = data.content;
        document.getElementById('priceTotal').innerHTML = data.priceTotal;
        document.getElementById('billTotal').innerHTML = data.billTotal;
    })
    .catch(function(err) {
        ToggleLoading();
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}

document.getElementById('fromDate').onchange = function() {
    var fromDate = document.getElementById('fromDate').value;
    var toDate = document.getElementById('toDate').value;
    if(fromDate > toDate) {
        document.getElementById('toDate').value = '';
    }
}

document.getElementById('toDate').onchange = function() {
    var fromDate = document.getElementById('fromDate').value;
    var toDate = document.getElementById('toDate').value;
    if(fromDate > toDate) {
        document.getElementById('fromDate').value = '';
    }
}