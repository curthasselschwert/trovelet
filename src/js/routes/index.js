/** @jsx React.DOM */
var Parse   = require('parse');
var emitter = require('../emitter');

module.exports = function() {
  var user = Parse.User.current();

  if (user) {
    emitter.emit('navigate', '/' + user.id);
  } else {
    emitter.emit('navigate', '/login');
  }
}
