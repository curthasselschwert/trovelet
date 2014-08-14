var SWIFTYPE_TOKEN = process.env.SWIFTYPE_TOKEN;
var request        = require('request');

module.exports = function(req, res) {
  var id  = req.params.id;
  var url = [
    'https://api.swiftype.com/api/v1/engines/content/document_types/pages/documents/',
     id,
     '?auth_token=',
     SWIFTYPE_TOKEN
  ].join('');

  console.log('URL: ', url);

  var options = {
    method: 'DELETE',
    url: url,
    json: true
  }

  request(options, function(err, response, body) {
    if (err) {
      return res.status(422).json(body);
    }

    return res.status(200).json();
  });
};
