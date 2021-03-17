module.exports.Hotel = function(req, res) {
    res.render('manager/hotel');
}

module.exports.Convenient = function(req, res) {
    res.render('manager/convenient');
}

module.exports.RoomType = function(req, res) {
    res.render('manager/roomType');
}

module.exports.CheckRoom = function(req, res) {
    res.render('manager/checkRoom');
}

module.exports.Comment = function(req, res) {
    res.render('manager/comment');
}

module.exports.Bill = function(req, res) {
    res.render('manager/bill');
}

module.exports.BillDetail = function(req, res) {
    res.render('manager/billDetail');
}

module.exports.ReplyComment = function(req, res) {
    res.render('manager/replyComment');
}

module.exports.UpdateRoomType = function(req, res) {
    res.render('manager/updateRoomType');
}