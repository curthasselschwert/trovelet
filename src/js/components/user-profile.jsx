/** @jsx React.DOM */
var React = require('react');
var Parse = require('parse');

var UserProfile = React.createClass({

  getInitialState: function() {
    return {
      user: {}
    }
  },

  componentDidMount: function() {
    var query = new Parse.Query(Parse.User);

    query.get(this.props.userid, {
      success: this.loadUser,
      error: this.error
    });
  },

  loadUser: function(response) {
    this.setState({ user: response.attributes });
  },

  error: function(error) {
    console.error(error);
  },

  render: function() {
    return (
      <div className="user-profile">
        User Profile { this.state.user.email }
      </div>
    );
  }

});

module.exports = UserProfile;
