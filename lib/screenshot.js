var request        = require('request');
var RSVP           = require('rsvp');
var querystring    = require('querystring');
var crypto         = require('crypto');

var URL2PNG_KEY    = process.env.URL2PNG_KEY;
var URL2PNG_SECRET = process.env.URL2PNG_SECRET;

function getScreenshots(url) {

  var images = [
    {
      'name': 'small',
      'url': url,
      'thumbnail_max_width': '212',
      'viewport': '1200x1600',
    },
    {
      'name': 'large',
      'url': url,
      'viewport': '1200x600',
      'fullpage': 'true'
    }
  ];

  return new RSVP.Promise(function(resolve, reject) {
    var screenshots = {};
    var count       = 0;
    var error       = null;

    //function finish(err) {
    //  count--;
    //  error = err;

    //  if (count === 0) {
    //    if(error) {
    //      return reject(error);
    //    } else {
    //      return resolve(screenshots);
    //    }
    //  }

    //  return;
    //}

    //images.forEach(function(image) {
    //  count++;
    //  var name = image.name;

      var image = images[0];
      var name  = image.name;
      delete image.name

      var query  = '?' + querystring.stringify(image);
      var hash   = crypto.createHash('md5').update(query + URL2PNG_SECRET).digest('hex');
      var remote = ['http://api.url2png.com/v6', URL2PNG_KEY, hash, 'json', query].join('/');
      var req    = { url: remote, json: true }

      request(req, function(e, response, body) {
        if (!e) {
          screenshots[name] = body.png;
          return resolve(screenshots);
        }

        //finish(e);
        reject(e);
      });
    //});
  });
}

module.exports = function(request, response) {
  var url = request.body.url;

  getScreenshots(url)
    .then(function(screenshots) {
      return response.status(200).json(screenshots);
    }, function(error) {
      return response.status(404).json(error);
    });
}
