/** @jsx React.DOM */
var React     = require('react');
var Parse     = require('parse');
var PagesList = require('./pages-list');

var UserProfile = React.createClass({

  getInitialState: function() {
    var user = new Parse.User();

    return { user: user };
  },

  componentDidMount: function() {
    var query = new Parse.Query(Parse.User);

    query.get(this.props.userid, {
      success: this.loadUser,
      error: this.error
    });
  },

  loadUser: function(response) {
    this.setState({ user: response });
  },

  error: function(error) {
    console.error(error);
  },

  render: function() {
    var user = this.state.user;

    return (
      <div className="user-profile">
        User Profile { user.get('email') }
        <PagesList user={ user } />
      </div>
    );
  }

});

module.exports = UserProfile;
