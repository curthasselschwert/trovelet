/** @jsx React.DOM */
var React = require('react');
var Login = require('../components/login');

module.exports = function(ctx) {
  React.renderComponent(
    <Login />,
    document.body
  );
}
