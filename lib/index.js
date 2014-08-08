var ORCHESTRATE_KEY ="6050600d-a968-476d-a8bf-d41eb5b7230a";
var request         = require('request');
var orchestrate     = require('orchestrate')(ORCHESTRATE_KEY);


module.exports = function(req, res) {
  var page = req.body;

  console.log('Page received', req.body);

  if (!page.id) {
    return res.status(422).json({ message: 'A page ID is required for indexing.' });
  }

  if (!page.userId) {
    return res.status(422).json({ message: 'A user ID is required for indexing.' });
  }

  if (!page.keywords) {
    return res.status(422).json({ message: 'Keywords are required for indexing.' });
  }

  orchestrate.put('Pages', page.id, {
    userId: page.userId,
    url: page.url,
    title: page.title,
    summary: summary,
    keywords: page.keywords,
    enitites: page.entities
  })
  .then(function(result) {
    return res.status(200).json(result);
  })
  .then(function(error) {
    console.log('Orch error ' + error);
    return res.status(422).json(error);
  })
};