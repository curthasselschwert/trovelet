/** @jsx React.DOM */
var React = require('react');
var UserProfile = require('../components/user-profile');

module.exports = function(ctx) {
  React.renderComponent(
    <UserProfile userid={ ctx.params.userid } />,
    document.body
  );
}
