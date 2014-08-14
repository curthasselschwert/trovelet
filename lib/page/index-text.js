var request         = require('request');
var SWIFTYPE_TOKEN  = process.env.SWIFTYPE_TOKEN;

module.exports = function(req, res) {
  var page  = req.body;
  var fields = []

  if (!page.id) {
    return res.status(422).json({ message: 'A page ID is required for indexing.' });
  }

  if (!page.userId) {
    return res.status(422).json({ message: 'A user ID is required for indexing.' });
  }

  if (!page.url) {
    return res.status(422).json({ message: 'A url is required for indexing.' });
  }

  fields.push({ name: 'user_id', value: page.userId, type: "string" });
  fields.push({ name: 'url', value: page.url, type: "string" });

  if (page.title) {
    fields.push({ name: 'title', value: page.title, type: "string" });
  }

  if (page.summary) {
    fields.push({ name: 'summary', value: page.summary, type: "text" });
  }

  if (page.text) {
    fields.push({ name: 'text', value: page.text, type: "text" });
  }

  var options = {
    method: 'POST',
    url: "https://api.swiftype.com/api/v1/engines/content/document_types/pages/documents/create_or_update.json",
    body: {
      auth_token: SWIFTYPE_TOKEN,
      document: {
        external_id: page.id,
        fields: fields
      }
    },
    json: true
  }

  request(options, function(err, response, body) {
    if (err || body.error) {
      var message = err || body.error;
      return res.status(422).json({ message: message });
    }

    return res.status(200).json(body);
  });
};
