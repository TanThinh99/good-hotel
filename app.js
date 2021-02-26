const express = require('express');
const app = express();
const port = 8000;

// database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hotel');

app.use(express.static('public'));

var apiRouter = require('./routes/api.route');

app.get('/', function(req, res) {
    res.send('Hello express av');
});

app.use('/api', apiRouter);

app.listen(port, function() {
    console.log('Server is running at '+ port);
});