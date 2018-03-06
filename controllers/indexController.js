var mySql = require("../config/database");

exports.getCategoryController = function(req, res) {
    res.render('index', { title: 'Express' });
}