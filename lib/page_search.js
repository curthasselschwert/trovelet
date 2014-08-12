var request         = require('request');
var Combinatorics   = require('js-combinatorics').Combinatorics;
var ORCHESTRATE_KEY = "6050600d-a968-476d-a8bf-d41eb5b7230a";

module.exports = function(req, res) {
  var terms  = req.query.terms;
  var index  = terms.length - 1;
  var userId = '(userId:' + req.query.userId + ')';
  var query;

  terms[index] = terms[index] + '*';
  terms = '(' + terms.join(' OR ') + ')';
  query = [userId, terms].join(' AND ');

  var options = {
    url: "https://api.orchestrate.io/v0/Pages",
    auth: {
      user: ORCHESTRATE_KEY
    },
    qs: {
      query: query
    },
    json: true
  }

  request(options, function(err, response, body) {
    if (err) {
      return res.status(422).json(err);
    }

    var results = body.results.map(function(page) {
      return { id: page.path.key, title: page.value.title, score: page.score };
    });

    return res.status(200).json({ input: req.query.terms, query: query, results: body });
  });
}
