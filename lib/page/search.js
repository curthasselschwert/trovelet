var request         = require('request');
var querystring     = require('querystring');
var merge           = require('merge');
var SWIFTYPE_TOKEN  = process.env.SWIFTYPE_TOKEN;

module.exports = function(req, res) {
  var term     = req.query.term;
  var userId   = req.query.userId;
  var per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;
  var page     = req.query.page ? parseInt(req.query.page) : 1;

  var options = {
    mathod: 'POST',
    url: 'https://api.swiftype.com/api/v1/engines/content/document_types/pages/search.json',
    body: {
      auth_token: SWIFTYPE_TOKEN,
      q: term,
      per_page: per_page,
      page: page
    },
    json: true
  }

  if (userId) {
    options.body.filters = {
      pages: {
        user_id: userId
      }
    }
  }

  request(options, function(err, response, body) {
    if (err) {
      return res.status(422).json(err);
    }

    var num_pages = body.info.pages.num_pages;

    console.log(body);

    var ids = body.records.pages.map(function(page) {
      return page.external_id;
    });

    var result = {
      total_pages: num_pages,
      ids: ids,
      prev: page > 1,
      next: page < num_pages,
    }

    return res.status(200).json(result);
  });
}
