'use strict';
var express = require('express');
var router = express.Router();

var indexController = require("../controllers/indexController");
/* GET home page. */
router.get('/', function (req, res) {
    indexController.getCategoryController(req, res);
});

module.exports = router;
