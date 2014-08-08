var ORCHESTRATE_KEY ="6050600d-a968-476d-a8bf-d41eb5b7230a";
var request         = require('request');
var orchestrate     = require('orchestrate')(ORCHESTRATE_KEY);


module.exports = function(req, res) {
  var page = req.body;

  if (!page.id) {
    res.status(422).json({ message: 'A page ID is required for indexing.' });
  }

  if (!page.userId) {
    res.status(422).json({ message: 'A user ID is required for indexing.' });
  }

  if (!page.keywords) {
    res.status(422).json({ message: 'Keywords are required for indexing.' });
  }

  res.status(200).json(page);

  //orchestrate.put('Pages', page.id, {
  // 
  //})
};
