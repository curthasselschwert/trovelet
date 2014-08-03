/** @jsx React.DOM */
var Parse   = require('parse');
var emitter = require('../emitter');

module.exports = function() {
  if (Parse.User.current()) {
    console.log('Logged in');
  } else {
    emitter.emit('navigate', '/login');
  }
}
