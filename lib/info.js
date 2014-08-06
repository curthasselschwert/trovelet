var request    = require('request');
var unfluff    = require('unfluff');

module.exports = function(req, res) {
  var result;

  url = req.params[0];
  url = decodeURIComponent(url).trim();
  url = url.match(/^https?/) ? url : 'http://' + url;

  request({ url: url, gzip: true, timeout: 5000 }, function(err, response, body) {
    if (err || !(/^2/).test(res.statusCode)) return next(err);

    result     = unfluff(body);
    result.url = url;

    res.json(200, result);
  });
}
