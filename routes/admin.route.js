var express = require('express');
var router = express.Router();

var mid = require('./../middlewares/middleware');
var adminCtrl = require('./../controllers/admin.controller');

router.use(mid.GoToAdminPage);

router.get('', adminCtrl.Index);
router.get('/account', adminCtrl.Account);

router.get('/convenient', adminCtrl.Convenient);
router.get('/convenient/:convenientID', adminCtrl.UpdateConvenient);
router.get('/addConvenient', adminCtrl.AddConvenient);

router.get('/role', adminCtrl.Role);
router.get('/role/:roleID', adminCtrl.UpdateRole);
router.get('/addRole', adminCtrl.AddRole);
router.get('/grantPermission/:roleID', adminCtrl.GrantPermission);

router.get('/grantManager', adminCtrl.GrantManager);

// =============== A J A X =================
    // Pagination
router.get('/getAccountForPagination', adminCtrl.GetAccountForPagination);

    // For grant hotel manager
router.get('/findHotelByKey', adminCtrl.FindHotelByKey);
router.get('/findManagerByKey', adminCtrl.FindManagerByKey);

    // Statistic
router.post('/statistic', adminCtrl.Statistic);

module.exports = router;