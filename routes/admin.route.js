var express = require('express');
var router = express.Router();

var adminCtrl = require('./../controllers/admin.controller');

router.get('', adminCtrl.Statistic);
router.get('/account', adminCtrl.Account);
router.get('/convenient', adminCtrl.Convenient);
router.get('/role', adminCtrl.Role);
router.get('/grantPermission', adminCtrl.GrantPermission);
router.get('/grantManager', adminCtrl.GrantManager);
router.get('/updateRole', adminCtrl.UpdateRole);
router.get('/addRole', adminCtrl.AddRole);
router.get('/addConvenient', adminCtrl.AddConvenient);

module.exports = router;