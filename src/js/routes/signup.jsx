/** @jsx React.DOM */
var React  = require('react');
var Signup = require('../components/signup');

module.exports = function(ctx) {
  React.renderComponent(
    <Signup />,
    document.body
  );
}
