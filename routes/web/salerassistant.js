var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var eventproxy = require('eventproxy');

var User = require('../../models/User.js');

function checkIdSalerassistant(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'salerassistant') {
    req.flash('error', "请先登录！");
    return res.redirect('/login');
  }
  next();
}

router.get('/', checkIdSalerassistant, function (req, res, next) {
  var ep = new eventproxy();
  var salers = [];
  User.find({role: 'saler'}).sort({id: -1}).exec(function (err, users) {
    users.forEach(function (entry) {
      if (salers.indexOf(entry.id) == -1)
        salers.push(entry.id);
    });
    ep.emit('saler');
  });
  ep.on('saler', function () {
    var now = new Date();
    var month = now.getFullYear() + "-" + ('0' + (now.getMonth() + 1)).slice(-2);
    res.render('salerassistant', {salers: salers, month: month});
  });
});

module.exports = router;
