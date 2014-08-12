var ORCHESTRATE_KEY = "6050600d-a968-476d-a8bf-d41eb5b7230a";
var request         = require('request');

module.exports = function(req, res) {
  var page = req.body;

  if (!page.id) {
    return res.status(422).json({ message: 'A page ID is required for indexing.' });
  }

  if (!page.userId) {
    return res.status(422).json({ message: 'A user ID is required for indexing.' });
  }

  if (!page.keywords) {
    return res.status(422).json({ message: 'Keywords are required for indexing.' });
  }

  var options = {
    url: "https://api.orchestrate.io/v0/Pages/" + page.id,
    auth: {
      user: ORCHESTRATE_KEY
    },
    body: {
      userId: page.userId,
      url: page.url,
      title: page.title,
      summary: page.summary,
      keywords: page.keywords,
      enitites: page.entities
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
