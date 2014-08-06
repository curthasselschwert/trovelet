/** @jsx React.DOM */
var React       = require('react');
var UserProfile = require('../components/user-profile');
var element     = require('../content-element');

module.exports = function(ctx) {
  React.renderComponent(
    <UserProfile userid={ ctx.params.userid } />,
    document.getElementById('content')
  );
}
