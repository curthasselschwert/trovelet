/** @jsx React.DOM */
var React   = require('react');
var Parse   = require('parse');
var Login   = require('../components/login');
var emitter = require('../emitter');

module.exports = function(ctx) {
  var user = Parse.User.current();

  if (user) {
    emitter.emit('navigate', '/' + user.id);
  } else {
    React.renderComponent(
      <Login />,
      document.body
    );
  }
}
