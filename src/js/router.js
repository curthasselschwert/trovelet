var Parse   = require('parse');
var page    = require('page');
var index   = require('./routes/index');
var login   = require('./routes/login');
var signup  = require('./routes/signup');
var emitter = require('./emitter');

page('/', index);
page('/login', login);
page('/signup', signup);

emitter.on('navigate', page);

module.exports = page;
