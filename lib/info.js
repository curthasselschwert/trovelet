var request    = require('request');
var unfluff    = require('unfluff');

module.exports = function(url, response) {
  var result;

  url = decodeURIComponent(url).trim();
  url = url.match(/^https?/) ? url : 'http://' + url;

  request({ url: url, gzip: true, timeout: 5000 }, function(err, res, body) {

    if (err || !(/^2/).test(res.statusCode)) {
      result = { message: "We're sorry, but we couldn't load that page." };
      response.statusCode = 404;
    }
    else {
      result     = unfluff(body);
      result.url = url;
      response.statusCode = 200;
    }

    result = JSON.stringify(result);
    response.end(result);
  });
}
