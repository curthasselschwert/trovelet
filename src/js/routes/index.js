/** @jsx React.DOM */
var Parse  = require('parse');
var router = require('../router');

module.exports = function(ctx) {
  if (Parse.User.current()) {
    console.log('Logged in');
  } else {
    router.show('/login');
  }
}
