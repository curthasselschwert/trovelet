/** @jsx React.DOM */
var React   = require('react');
var error   = require('../error-message');
var router  = require('../router');
var emitter = require('../emitter');

var Signup = React.createClass({

  getInitialState: function() {
    return { error: null };
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var email    = this.refs.email.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();

    Parse.User.logIn(email, password, {
      success: this.handleSuccess,
      error: this.handleError
    });
  },

  handleSuccess: function(user) {
    emitter.emit('navigate', '/' + user.id);
  },

  handleError: function(user, err) {
    var message = error.get(err.message);

    console.log('Error', message);
    this.setState({ error: message });
  },

  signup: function() {
    emitter.emit('navigate', '/signup');
  },

  render: function() {
    return (
      <div className="signup">
        <form action="/" onSubmit={ this.handleSubmit }>
          <div className="error">{ this.state.error }</div>
          <input className="email" type="text" ref="email" placeholder="email" />
          <input className="password" type="password" ref="password" placeholder="password" />
          <button className="submit" type="submit">Login</button>
        </form>
        <p className="message">
          Don't have an account? Sign up <span onClick={ this.signup }>here.</span>
        </p>
      </div>
    );
  }

});

module.exports = Signup;
