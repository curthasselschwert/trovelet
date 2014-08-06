var express       = require('express');
var compression   = require('compression');
var morgan        = require('morgan');
var webpack       = require('webpack');
var cors          = require('cors');
var info          = require('./lib/info');
var simple        = require('./lib/simple');
var screenshot    = require('./lib/screenshot');
var app           = express();

var LOGFMT = app.get('env') === 'development' ? 'dev' : 'combined';
var PORT   = process.env.PORT || 3000;

app.use(morgan(LOGFMT));
app.use(cors());
app.use(compression());

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/dist/app.html');
});

app.get('/signup', function(req, res) {
  res.sendFile(__dirname + '/dist/app.html');
});

app.get('/notfound', function(req, res) {
  res.sendFile(__dirname + '/dist/404.html');
});

app.get(/\/info\/(.+)/, info);
app.get('/screenshot/:id', screenshot);

if (app.get('env') === 'development') {
  app.get(/.*\.js(on)?$/, function(req, res) {
    var path = 'http://localhost:3001' + req.path;
    console.log('Redirect', path);
    res.redirect(301, path);
  });
}

app.get('/:handle', function(req, res) {
  res.sendFile(__dirname + '/dist/app.html');
});

app.use(express.static(__dirname + '/dist'));

//var server = http.createServer(function(request, response) {
//  var match = paramify(request.url);
//
//  console.log(new Date(), '[request]', request.method, request.url);
//
//  if (match('/simple/*')) {
//    return simple(match.params[0], response);
//  }
//
//  if (match('/screenshot/:id')) {
//    return screenshot(match.params.id, response);
//  }
//
//  response.statusCode = 404;
//  response.end('{}');
//});


// Load webpack dev server in development
if (app.get('env') == 'development') {
  var webpackServer = require('./lib/webpack-server');

  webpackServer.listen(3001, 'localhost', function() {
    console.info('Webpack dev server listening on 3001');
  });
}

app.listen(PORT, function() {
  console.info('Server is listentng on ' + PORT);
});
