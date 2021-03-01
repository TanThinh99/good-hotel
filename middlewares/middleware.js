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