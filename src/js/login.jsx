/** @jsx React.DOM */
var React = require('react');
var error = require('./error-message');

var Login = React.createClass({

  getInitialState: function() {
    return { error: null };
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var email    = this.refs.email.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();

    Parse.User.login(email, password, {
      success: this.handleSuccess,
      error: this.handleError
    });
  },

  handleSuccess: function(user) {
    console.log('Success', user);
  },

  handleError: function(user, err) {
    var message = error.get(err.message);

    console.log('Error', message);
    this.setState({ error: message });
  },

  render: function() {
    return (
      <div className="auth login">
        <form action="/" onSubmit={ this.handleSubmit }>
          <div className="error">{ this.state.error }</div>
          <input className="email" type="text" ref="email" placeholder="email" />
          <input className="password" type="password" ref="password" placeholder="password" />
          <button className="submit" type="submit">Login</button>
        </form>
      </div>
    );
  }

});

module.exports = Login;
