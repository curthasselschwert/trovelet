var Parse  = require('parse');
var page   = require('page');
var login  = require('./routes/login');
var signup = require('./routes/signup');

page('/', function(ctx) {
  if (Parse.User.current()) {
    console.log('Logged in');
  } else {
    page.show('/login');
  }
});
page('/login', login);
page('/signup', signup);

module.exports = page;
