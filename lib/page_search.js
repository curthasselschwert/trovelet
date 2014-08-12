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

    terms[index] = terms[index] + '*';
    terms = '(' + terms.join(' OR ') + ')';
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

    var pages = body.results.map(function(page) {
      return { id: page.path.key };
    });

    var result = {
      count: body.count,
      total_count: body.total_count,
      page: Math.floor(offset / limit) + 1,
      total_pages: Math.ceil(body.total_count / limit),
      pages: pages,
      prev: null,
      next: null
    }

    if (body.next) {
      next = merge(page, { offset: offset + limit });
      next = querystring.stringify(next);

      result.next = '/pages/search?' + next;
    }

    if (body.prev) {
      prev = merge(page, { offset: offset - limit });
      prev = querystring.stringify(prev);

      result.prev = '/pages/search?' + prev;
    }

    return res.status(200).json(result);
  });
}
