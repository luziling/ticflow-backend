var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');
var List = require('../models/List.js');

router.get('/engineers', function (req, res) {
	User.find({role: "engineer"}, /*'id',*/ function (err, engineers) { //TODO
		if (err) {
			return res.status(400).send("err in get /users/engineers");
		} else {
			//console.log(engineers);
			return res.status(200).json(engineers);
		}
	});
});

router.get('/engineers/workloads', function (req, res) {
	User.find({role: "engineer"}, /*'id',*/ function (err, engineers) {
		if (err) {
			return res.status(400).send("err in get /users/engineers/workloads");
		} else {
			var engineerIds = [];
			var workloads = [];
			for (var i = 0; i < engineers.length; i++) {
				engineerIds.push(engineers[i].id);
				workloads.push({engineerId: engineerIds[i], completed: 0, uncompleted: 0});
			}
			List.find(function (err, lists) {
				if (err) {
					return res.status(400).send("err in get /users/engineers/workloads");
				}
				else {
					for (var i = 0; i < lists.length; i++) {
						var index = engineerIds.indexOf(lists[i].engineer);
						if (index != -1) {
							if (lists[i].completed === true) {
								workloads[index].completed++;
							}
							else {
								workloads[index].uncompleted++;
							}
						}
					}
					res.status(200).json(workloads);
				}
			});

		}
	});
});

router.post('/signin', function (req, res) {
	User.findOne({
		id: req.body.id,
		password: req.body.password
	}, function (err, user) {
		if (err) {
			return res.status(400).send("err in post /users/signin");
		} else if (user === null) {
			return res.status(400).send("Invalid username or password");
		} else {
			return res.status(200).json(user);
		}
	});
});

router.post('/signup', function (req, res) {
	var user = new User(req.body);

	user.save(function (err) {
		if (err) {
			return res.status(400).send("err in post /users/signup");
		} else {
			return res.status(200).json(user);
		}
	});
});

module.exports = router;