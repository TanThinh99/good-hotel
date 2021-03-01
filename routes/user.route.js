var express = require('express');
var router = express.Router();

var userCtrl = require('./../controllers/user.controller');

router.get('/login', userCtrl.Login);

module.exports = router;