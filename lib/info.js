var request     = require('request');
var unfluff     = require('unfluff');
var querystring = require('querystring');

var EMBEDLY_TOKEN = '9bc0543ea5004abc8797aaec8668c537';

module.exports = function(req, res) {
  var url = req.body && req.body.url;

  if (!url) {
    var error = { message: 'Please enter a web page address.' };
    return res.status(422).json(error);
  }

  url = url.match(/^https?/) ? url : 'http://' + url;
  url = decodeURIComponent(url).trim();

  var embedly     = 'http://api.embed.ly/1/extract?'
  var embedlyOpts = {
    key: EMBEDLY_TOKEN,
    url: url
  }

  var embedly = embedly + querystring.stringify(embedlyOpts);

  var options = {
    url: embedly,
    gzip: true,
    timeout: 5000,
    json: true
  }

  request(options, function(err, response, body) {
    if (err || body.type == 'error') {
      var error = { 
        message: "We're sorry, we couldn't add that page. " +
                 "Please check that you entered the address correctly."
      };

      return res.status(404).json(error);
    };

    console.log('Embedly response', body);

    var result = {};

    result.url      = url;
    result.title    = body.title;
    result.summary  = body.description;
    result.entities = body.entities && body.entities.map(function(ent) { return ent.name });
    result.keywords = body.keywords && body.keywords.map(function(keyword) { return keyword.name });

    res.status(200).json(200, result);
  });
}
