var request         = require('request');
var querystring     = require('querystring');
var merge           = require('merge');
var ORCHESTRATE_KEY = "6050600d-a968-476d-a8bf-d41eb5b7230a";

module.exports = function(req, res) {
  var terms  = req.query.terms;
  var userId = req.query.userId;
  var limit  = req.query.limit ? parseInt(req.query.limit) : 10;
  var offset = req.query.offset ? parseInt(req.query.offset) : 0;
  var query  = '*';
  var page   = {
    terms: terms,
    userId: userId,
    limit: limit
  }

  if (userId) {
    userId = '(userId:' + req.query.userId + ')';
  }

  if (terms) {
    var index  = terms.length - 1;

    terms = terms.map(function(term) {
      return term + '*';
    });
    terms = 'keywords:(' + terms.join(' OR ') + ')';
  }

  if (terms || userId) {
    query = [userId, terms].reduce(function(prev, curr) {
      if (curr) { prev.push(curr) }
      return prev;
    }, [])

    query = query.join(' AND ');
  }

  var options = {
    url: "https://api.orchestrate.io/v0/Pages",
    auth: {
      user: ORCHESTRATE_KEY
    },
    qs: {
      query: query,
      limit: limit,
      offset: offset
    },
    json: true
  }

  request(options, function(err, response, body) {
    if (err) {
      return res.status(422).json(err);
    }

    var ids = body.results.map(function(page) {
      return page.path.key;
    });

    var result = {
      total_count: body.total_count,
      ids: ids,
      prev: body.prev,
      next: body.next
    }

    return res.status(200).json(result);
  });
}
