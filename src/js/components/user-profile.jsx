/** @jsx React.DOM */
var React     = require('react');
var Parse     = require('parse');
var PagesList = require('./pages-list');
var AddPage   = require('./add-page');

var UserProfile = React.createClass({

  getInitialState: function() {
    var user    = new Parse.User();
    var current = new Parse.User.current();

    return { user: user, currentUser: current };
  },

  componentDidMount: function() {
    var query = new Parse.Query(Parse.User);

    query.get(this.props.userid)
      .then(this.setUser, this.error);
  },

  setUser: function(response) {
    this.setState({ user: response });
  },

  error: function(error) {
    window.location = '/notfound';
  },

  addPage: function() {
    var user    = this.state.user;
    var current = this.state.currentUser;

    if (user.id == current.id) {
      return <AddPage />;
    }

    return null;
  },

  content: function() {
    var user = this.state.user;

    if (user.id) {
      return (
        <div className="user-profile">
          <div className="user-info">
            { user.get('name') }
          </div>
          <PagesList user={ user } />
        </div>
      );
    }

    return <div>Loading...</div>;
  },

  render: function() {
    return this.content();
  }

});

module.exports = UserProfile;
