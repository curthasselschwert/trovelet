var express       = require('express');
var compression   = require('compression');
var memwatch      = require('memwatch');
var morgan        = require('morgan');
var cors          = require('cors');
var bodyParser    = require('body-parser');
var page          = require('./lib/page');
var app           = express();

var DEV    = (app.get('env') === 'development')
var LOGFMT = DEV ? 'dev' : 'combined';
var PORT   = process.env.PORT || 3000;

app.use(morgan(LOGFMT));
app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/dist/app.html');
});

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/dist/app.html');
});

app.get('/signup', function(req, res) {
  res.sendFile(__dirname + '/dist/app.html');
});

app.get('/notfound', function(req, res) {
  res.sendFile(__dirname + '/dist/404.html');
});

app.get('/pages/search', page.search);
app.post('/pages/info', page.info);
app.post('/pages/screenshot', page.screenshot);
app.post('/pages/index', page.index);

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
app.use(compression());

// Load webpack dev server in development
if (DEV) {
  var webpackServer = require('./lib/webpack-server');

  webpackServer.listen(3001, 'localhost', function() {
    console.info('Webpack dev server listening on 3001');
  });
}

memwatch.on('leak', function(info) {
  var max = 500000000;
  //var current_base = stats.current_base;

  console.log("Leak: ", info.growth / 1024 / 1024);

  //if (max - current_base < 0) {
  //  console.error('Over memory limit. Exiting process.');
  //  process.exit(1);
  //}
});

app.listen(PORT, function() {
  console.info('Server is listentng on ' + PORT);
});
