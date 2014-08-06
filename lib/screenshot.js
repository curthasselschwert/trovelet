var request        = require('request');
var RSVP           = require('rsvp');
var querystring    = require('querystring');
var crypto         = require('crypto');

var PARSE_APP_KEY  = process.env.PARSE_APP_KEY;
var PARSE_API_KEY  = process.env.PARSE_API_KEY;

var URL2PNG_KEY    = process.env.URL2PNG_KEY;
var URL2PNG_SECRET = process.env.URL2PNG_SECRET;

function getPage(id) {
  var options = {
    url: 'https://api.parse.com/1/classes/Page/' + id,
    headers: {
      "X-Parse-Application-Id": PARSE_APP_KEY,
      "X-Parse-REST-API-Key": PARSE_API_KEY
    },
    json: true
  };

  return new RSVP.Promise(function(resolve, reject) {
    request(options, function(error, response, body) {
      if (error) return reject(error);

      console.log('Page images for ' + id, body.images);
      return resolve(body);
    });
  });
}

function savePage(id, images) {
  var images = '{ "images": ' + images + '}';

  var options = {
    method: 'PUT',
    url: 'https://api.parse.com/1/classes/Page/' + id,
    headers: {
      "X-Parse-Application-Id": PARSE_APP_KEY,
      "X-Parse-REST-API-Key": PARSE_API_KEY,
      "Content-Type": "application/json"
    },
    body: images
  };

  console.log('To save', images);

  request(options, function(error, response, body) {
    if (error) {
      console.error('Error updating page ' + id, error);
    }

    console.info('Page images saved for ' + id);
    return;
  });
}

function getScreenshots(page) {
  var exist = page.images && page.images.small && page.images.large;

  var small = {
    'url': page.url,
    'thumbnail_max_width': '212',
    'viewport': '1200x1600',
  }

  var large = {
    'url': page.url,
    'viewport': '1200x600',
    'fullpage': 'true'
  }

  var smquery = '?' + querystring.stringify(small);
  var lgquery = '?' + querystring.stringify(large);
  var smhash  = crypto.createHash('md5').update(smquery + URL2PNG_SECRET).digest('hex');
  var lghash  = crypto.createHash('md5').update(lgquery + URL2PNG_SECRET).digest('hex');
  var smurl   = ['http://api.url2png.com/v6', URL2PNG_KEY, smhash, 'json', smquery].join('/');
  var lgurl   = ['http://api.url2png.com/v6', URL2PNG_KEY, lghash, 'json', lgquery].join('/');
  var smreq   = { url: smurl, json: true }
  var lgreq   = { url: lgurl, json: true }

  return new RSVP.Promise(function(resolve, reject) {
    if (exist) return resolve(page.images);

    var images = {};
    var count  = 2;

    function finish() {
      count--;
      if (count == 0) return resolve(images);
    }

    request(smreq, function(error, response, body) {
      if (error) return reject(error);

      images.small = body.png;
      finish();
    });

    request(lgreq, function(error, response, body) {
      if (error) return reject(error);

      images.large = body.png;
      finish();
    });
  });
}

module.exports = function(id, response) {
  getPage(id)
    .then(getScreenshots)
    .then(function(screenshots) {
      var screenshots = JSON.stringify(screenshots);

      response.statusCode = 200;
      response.end(screenshots);

      savePage(id, screenshots);
    }, function(error) {
      console.log(error);
      response.statusCode = 404;
      response.end(error);
    });
}
