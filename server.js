var express       = require('express');
var compression   = require('compression');
var morgan        = require('morgan');
var webpack       = require('webpack');
var cors          = require('cors');
var info          = require('./lib/info');
var simple        = require('./lib/simple');
var screenshot    = require('./lib/screenshot');
var app           = express();

var DEV    = (app.get('env') === 'development')
var LOGFMT = DEV ? 'dev' : 'combined';
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

if (DEV) {
  app.get(/.*\.js(on)?$/, function(req, res) {
    var path = 'http://localhost:3001' + req.path;
    res.redirect(301, path);
  });
}

app.get('/:handle', function(req, res) {
  res.sendFile(__dirname + '/dist/app.html');
});

app.use(express.static(__dirname + '/dist'));

// Load webpack dev server in development
if (DEV) {
  var webpackServer = require('./lib/webpack-server');

  webpackServer.listen(3001, 'localhost', function() {
    console.info('Webpack dev server listening on 3001');
  });
}

app.listen(PORT, function() {
  console.info('Server is listentng on ' + PORT);
});
