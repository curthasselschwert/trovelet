/** @jsx React.DOM */
var React   = require('react');
var error   = require('../error-message');
var emitter = require('../emitter');

var Signup = React.createClass({

  getInitialState: function() {
    return { error: null };
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var name     = this.refs.name.getDOMNode().value.trim();
    var email    = this.refs.email.getDOMNode().value.trim();
    var password = this.refs.password.getDOMNode().value.trim();
    var user     = new Parse.User({
      name: name,
      username: email,
      email: email,
      password: password
    });

    user.signUp(null, {
      success: this.handleSuccess,
      error: this.handleError
    });
  },

  handleSuccess: function(user) {
    emitter.emit('navigate', '/' + user.id);
  },

  handleError: function(user, err) {
    var message = error.get(err.message);

    this.setState({ error: message });
  },

  login: function() {
    emitter.emit('navigate', '/login');
  },

  render: function() {
    return (
      <div className="signup">
        <form action="/" onSubmit={ this.handleSubmit }>
          <div className="error">{ this.state.error }</div>
          <input className="name" type="text" ref="name" placeholder="Full Name" />
          <input className="email" type="text" ref="email" placeholder="email@example.com" />
          <input className="password" type="password" ref="password" placeholder="password" />
          <button className="submit" type="submit">Sign Up</button>
        </form>
        <p className="message">
          Already have an account? Login <a href="/login">here</a>.
        </p>
      </div>
    );
  }

});

module.exports = Signup;
