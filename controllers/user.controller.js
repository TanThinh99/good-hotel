module.exports.Index = function(req, res) {
    res.render('user/index');
}

module.exports.Account = function(req, res) {
    res.render('user/account');
}

module.exports.HotelDetail = function(req, res) {
    res.render('user/hotelDetail');
}

module.exports.Checkout = function(req, res) {
    res.render('user/checkout');
}