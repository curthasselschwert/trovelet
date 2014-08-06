var fs = require('fs');

module.exports = function(name, response) {
  var filename = __dirname + '/../dist/' + name + '.html'
  var file     = fs.createReadStream(filename);

  file.on('open', function() {
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
  });

  return file.pipe(response);
};
