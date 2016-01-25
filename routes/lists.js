var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var List = require('../models/List.js');

router.post('/', function (req, res) {
	List.create(req.body, function (err, list) {
		if (err) {
			return res.status(400).send("err in post /lists");
		} else {
			return res.status(200).json(list);
		}
	});
});

router.get('/', function (req, res) {
	var page = (req.query.page === undefined) ? 0 : req.query.page;
	var limit = (req.query.limit === undefined) ? 10 : req.query.limit;

	delete req.query.page;
	delete req.query.limit;

	List.find(req.query).skip(page * limit).limit(limit).sort({date: -1}).exec(function (err, lists) {
		if (err) {
			return res.status(400).send("err in get /lists");
		} else {
			return res.status(200).json(lists);
		}
	});
});

router.post('/:_id', function (req, res) {
	List.findByIdAndUpdate(req.params._id, req.body, function (err, list) {
		if (err) {
			return res.status(400).send("err in put /lists/:_id");
		} else {
			return res.status(200).json(list);
		}
	});
});

router.get('/number', function (req, res) {
	List.find(req.query, function (err, lists) {
		if (err) {
			return res.status(400).send("err in get /lists/number");
		} else {
			return res.status(200).json(lists.length);
		}
	});
});

router.get('/totalvalue', function (req, res) {
	List.find(req.query, function (err, lists) {
		if (err) {
			return res.status(400).send("err in get /lists/totalValue");
		} else {
			var totalValue = 0;
			lists.forEach(function (entry) {
				totalValue += entry.value;
			});
			return res.status(200).json(totalValue);
		}
	});
});

router.get('/clientinfo', function (req, res) {
	List.find().sort({date: -1}).select('client').exec(function (err, lists) {
		if (err) {
			return res.status(400).send("err in get /lists/clientinfo");
		} else {
			return res.status(200).json(lists);
		}
	});
});

router.get('/:_id', function (req, res) {
	List.findById(req.params._id, function (err, list) {
		if (err) {
			return res.status(400).send("err in get /lists/:_id");
		} else {
			return res.status(200).json(list);
		}
	});
});

module.exports = router;
