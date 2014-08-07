var request    = require('request');
var unfluff    = require('unfluff');

module.exports = function(req, res) {
  var url = req.body && req.body.url;

  if (!url) {
    var error = { message: 'Please enter a web page address.' };
    return res.status(422).json(error);
  }

  url = decodeURIComponent(url).trim();
  url = url.match(/^https?/) ? url : 'http://' + url;

  request({ url: url, gzip: true, timeout: 5000 }, function(err, response, body) {
    if (err || !(/^2/).test(res.statusCode)) {
      var error = { 
        message: "We're sorry, we couldn't add that page. " +
                 "Please check that you entered the address correctly."
      };

      return res.status(404).json(error);
    };

    result     = unfluff(body);
    result.url = url;

    res.json(200, result);
  });
}
