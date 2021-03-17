require('dotenv').config();

const express = require('express');
const app = express();
const port = 8000;

var session = require('express-session');

// database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hotel');

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.use(session({ secret: process.env.SECRET_SESSION }));

var apiRouter = require('./routes/api.route');
var userRouter = require('./routes/user.route');
var managerRouter = require('./routes/manager.route');
var adminRouter = require('./routes/admin.route');

app.use('/api', apiRouter);
app.use('', userRouter);
app.use('/manager', managerRouter);
app.use('/admin', adminRouter);
// var fa = require('./font-awesome-4.7.0.json');
// app.get('/abc', function(req, res) {
//     res.send(fa['4.7.0'][20]);
// })

app.listen(port, function() {
    console.log('Server is running at '+ port);
});