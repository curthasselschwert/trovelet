var request     = require('request');
var unfluff     = require('unfluff');
var stopwords   = require('stopwords').english;

module.exports = function(req, res) {
  var url  = req.body && req.body.url;

  if (!url) {
    var error = { message: 'Please enter a web page address.' };
    return res.status(422).json(error);
  }

  url = url.match(/^https?/) ? url : 'http://' + url;
  url = decodeURIComponent(url).trim();

  var options = {
    url: url,
    timeout: 10000
  }

  request(options, function(err, response, body) {
    if (err || body.type == 'error') {
      var error = { 
        message: "We're sorry, we couldn't add that page. " +
                 "Please check that you entered the address correctly."
      };

      return res.status(404).json(error);
    };

    var data = unfluff(body);

    var result = {
      url: data.canonicalUrl || url,
      title: data.title,
      summary: data.description,
      text: data.text,
      image: data.image,
      video: data.video
    };

    return res.status(200).json(result);
  });
}
