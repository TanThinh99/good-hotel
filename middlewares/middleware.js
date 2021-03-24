var jwt = require('jsonwebtoken');

module.exports.IsAdmin = function(req, res, next) {
    jwt.verify(req.session.token, process.env.SECRET_JWT, function(err, data) {
        if( err ) {
            console.log('token is not exist or invalid');
            res.redirect('http://localhost:8000/login');            
        }
        else {
            console.log(data);
            if(data.role == '0') {
                next();
            }
            else {
                console.log('user does not permission');
                res.redirect('http://localhost:8000/login');
            }
        }
    });
}

module.exports.GoToAdminPage = function(req, res, next) {
    var decode = req.session.decode;
    if(decode.allow == 'Vao trang admin') {
        next();
    }
    else {
        res.redirect('/');
    }    
}

module.exports.GoToManagerPage = function(req, res, next) {
    var decode = req.session.decode;
    var notAllow = true;
    if(decode.allow == 'Vao trang quan ly khach san') {
        var hotelID = req.params.hotelID;
        if(hotelID == decode.hotelID) {
            notAllow = false;
            next();
        }
    }
    if( notAllow ) {
        res.redirect('/');
    }
}

module.exports.GoToAccountUser = function(req, res, next) {
    var decode = req.session.decode;
    if(decode != undefined) {
        next();    
    }
    else {
        res.redirect('/');
    }
}