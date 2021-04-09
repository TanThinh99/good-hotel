function FilterHotel() {
    var filterName = document.getElementById('filterHotel').value;
    var key = document.getElementById('foundByKey').value;
    window.location.href = '/?key='+ key +'&filter='+ filterName;
}

document.getElementById('filterHotel').value = document.getElementById('filterType').value;
document.getElementById('filterHotel').style.display = 'block';
var niceSelectList = document.getElementsByClassName('nice-select');
for(var i=0; i<niceSelectList.length; i++) {
    niceSelectList[i].style.display = 'none';
}
function ChoosePaginateItem(pageSelected) {
    var key = document.getElementById('foundByKey').value;
    var filter = document.getElementById('filterType').value;
    axios({
        method: 'GET',
        url: 'http://localhost:8000/getHotelForPagination?key='+ key +'&filter='+ filter +'&pageSelected='+ pageSelected,
    })
    .then(function(response) {
        document.getElementById('containerHotel').innerHTML = response.data.hotelData;
        document.getElementById('containerPagiItem').innerHTML = response.data.paginateData;
    })
    .catch(function(err) {
        alert('Có lỗi hệ thống, quý khách vui lòng thử lại!');
        console.log(err);
    });
}