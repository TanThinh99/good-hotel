module.exports.Statistic = function(req, res) {
    res.render('admin/statistic');
}

module.exports.Account = function(req, res) {
    res.render('admin/account');
}

module.exports.Convenient = function(req, res) {
    res.render('admin/convenient');
}

module.exports.Role = function(req, res) {
    res.render('admin/role');
}

module.exports.GrantPermission = function(req, res) {
    res.render('admin/grantPermission');
}

module.exports.GrantManager = function(req, res) {
    res.render('admin/grantManager');
}

module.exports.UpdateRole = function(req, res) {
    res.render('admin/updateRole');
}

module.exports.AddRole = function(req, res) {
    res.render('admin/addRole');
}

module.exports.AddConvenient = function(req, res) {
    res.render('admin/addConvenient');
}