/** @jsx React.DOM */
var React   = require('react');
var Parse   = require('parse');
var Signup  = require('../components/signup');
var emitter = require('../emitter');

module.exports = function(ctx) {
  var user = Parse.User.current();

  if (user) {
    emitter.emit('navigate', '/' + user.id);
  } else {
    React.renderComponent(
      <Signup />,
      document.body
    );
  }
}
