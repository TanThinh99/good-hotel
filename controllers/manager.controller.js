var axios = require('axios');

module.exports.Hotel = async function(req, res) {
    var hotelID = req.params.hotelID;
    var hotel = await axios({
        method: 'GET',
        url: 'http://localhost:8000/api/khach_san/' +hotelID
    });
    res.render('manager/hotel', {
        hotel: hotel.data
    });
}

module.exports.Convenient = function(req, res) {
    var hotelID = req.params.hotelID;
    res.render('manager/convenient', {
        hotelID: hotelID
    });
}

module.exports.RoomType = function(req, res) {
    var hotelID = req.params.hotelID;
    res.render('manager/roomType', {
        hotelID: hotelID
    });
}

module.exports.UpdateRoomType = function(req, res) {
    var hotelID = req.params.hotelID;
    var roomTypeID = req.params.roomTypeID;
    res.render('manager/updateRoomType', {
        hotelID: hotelID
    });
}

module.exports.AddRoomType = function(req, res) {
    var hotelID = req.params.hotelID;
    res.render('manager/addRoomType', {
        hotelID: hotelID
    });
}

module.exports.CheckRoom = function(req, res) {
    var hotelID = req.params.hotelID;
    res.render('manager/checkRoom', {
        hotelID: hotelID
    });
}

module.exports.Comment = function(req, res) {
    var hotelID = req.params.hotelID;
    res.render('manager/comment', {
        hotelID: hotelID
    });
}

module.exports.ReplyComment = function(req, res) {
    var hotelID = req.params.hotelID;
    var commentID = req.params.commentID;
    res.render('manager/replyComment', {
        hotelID: hotelID
    });
}

module.exports.Bill = function(req, res) {
    var hotelID = req.params.hotelID;
    res.render('manager/bill', {
        hotelID: hotelID
    });
}

module.exports.BillDetail = function(req, res) {
    var hotelID = req.params.hotelID;
    var billID = req.params.billID;
    res.render('manager/billDetail', {
        hotelID: hotelID
    });
}