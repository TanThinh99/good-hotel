function ToggleLoading() {
    var loadingDiv = document.getElementById('loadingDiv');
    if(loadingDiv.style.display == 'block') {
        loadingDiv.style.display = 'none';
    }
    else {
        loadingDiv.style.display = 'block';
    }
}