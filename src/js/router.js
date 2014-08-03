var Parse  = require('parse');
var page   = require('page');
var index  = require('./routes/index');
var login  = require('./routes/login');
var signup = require('./routes/signup');

page('/', index);
page('/login', login);
page('/signup', signup);

module.exports = page;
