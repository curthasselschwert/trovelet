var request        = require('request');
var RSVP           = require('rsvp');
var querystring    = require('querystring');
var crypto         = require('crypto');
var memwatch       = require('memwatch');

var URL2PNG_KEY    = process.env.URL2PNG_KEY;
var URL2PNG_SECRET = process.env.URL2PNG_SECRET;

function screenshots(url, next) {

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

  var promises = images.map(function(image) {
    return screenshot(image);
  });

  RSVP.all(promises)
    .then(function(images) {
      var screenshots = {};

      images.forEach(function(image) {
        screenshots[image.name] = image.url;
      });

      next(null, screenshots);
    })
    .catch(function(error) {
      next(error);
    });
}

function screenshot(options) {
  var promise = new RSVP.Promise(function(resolve, reject) {
    var name = options.name;

    delete options.name

    var query  = '?' + querystring.stringify(options);
    var hash   = crypto.createHash('md5').update(query + URL2PNG_SECRET).digest('hex');
    var remote = ['http://api.url2png.com/v6', URL2PNG_KEY, hash, 'json', query].join('/');
    var req    = { url: remote, json: true }

    request(req, function(error, response, body) {
      if (error) {
        return reject(error);
      } else {
        return resolve({ name: name, url: body.png });
      }
    });
  });

  return promise;
}

module.exports = function(request, response) {
  var url = request.body.url;

  screenshots(url, function(error, screenshots) {
    if (error) {
      return response.status(404).json(error);
    }

    return response.status(200).json(screenshots);
  });
}
