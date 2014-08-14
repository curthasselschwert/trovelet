var request         = require('request');
var SWIFTYPE_TOKEN  = process.env.SWIFTYPE_TOKEN;

module.exports = function(req, res) {
  var page = req.body;

  if (!page.id) {
    return res.status(422).json({ message: 'A page ID is required for indexing.' });
  }

  if (!page.userId) {
    return res.status(422).json({ message: 'A user ID is required for indexing.' });
  }

  var options = {
    method: 'POST',
    url: "https://api.swiftype.com/api/v1/engines/content/document_types/pages/documents.json",
    body: {
      auth_token: SWIFTYPE_TOKEN,
      document: {
        external_id: page.id,
        fields: [
          { name: 'url', value: page.url, type: "string" },
          { name: 'title', value: page.title, type: "string" },
          { name: 'summary', value: page.summary, type: "text" },
          { name: 'text', value: page.text, type: "text" },
          { name: 'user_id', value: page.userId, type: "string" }
        ]
      }
    },
    json: true
  }

  request(options, function(err, response, body) {
    if (err) {
      return res.status(422).json(err);
    }

    return res.status(200).json(body);
  });
};
