var read     = require('node-readability');
var sanitize = require('sanitize-html');

module.exports = function(url, response) {
  url = decodeURIComponent(url);
  url = url.match(/^https?/) ? url : 'http://' + url;

  read(url, function(err, article, meta) {
    if (err || !article.content) {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end('<!doctype html><html><body><h1>404</h1></body></html>');
    }
    else {
      var result = sanitize(article.content, {
        //allowedTags: sanitize.defaults.allowedTags.concat([ 'img', 'video', 'source' ]),
        allowedTags: [
          'p', 'img', 'a', 'video', 'source', 'ol', 'ul', 'li',
          'em', 'i', 'dt', 'dd', 'h1', 'h2', 'h3', 'h4', 'h5' ,'h6'
        ],
        allowedAttributes: {
          'a': [ 'href' ],
          'img': [ 'src' ],
          'video': [ 'controls', 'height', 'width', 'src', 'poster' ],
          'source': [ 'media', 'src', 'type' ]
        }
      })

      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.statusCode = 200;
      response.end(result);
    }
  });
}
