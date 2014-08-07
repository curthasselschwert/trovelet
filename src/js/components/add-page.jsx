/** @jsx React.DOM */
var React   = require('react');
var Parse   = require('parse');
var request = require('browser-request');
var emitter = require('../emitter');
var msg     = "Enter the address of the page you would like to add.";

var AddPage = React.createClass({

  getInitialState: function() {
    var user = Parse.User.current();

    return { user: user, error: false, active: false, message: msg };
  },

  activate: function() {
    this.setState({ active: true });
  },

  deactivate: function() {
    this.setState({ error: false, message: msg, active: false, loading: false });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({ error: false, message: null, loading: true }, this.addPage);
  },

  handleSuccess: function(page) {
    emitter.emit('page added');
    this.refs.url.getDOMNode().value = null;
    this.setState({ error: false, loading: false, active: false, message: msg });
  },

  handleError: function(error) {
    this.setState({ error: true, message: error, loading: false });
    return Parse.Promise.error(error);
  },

  addPage: function() {
    var url = this.refs.url.getDOMNode().value.trim();

    this.getInfo(url)
      .then(this.createPage)
      .then(this.handleSuccess, this.handleError);
  },

  getInfo: function(url) {
    var promise = new Parse.Promise();
    var options = {
      url: '/info/',
      method: 'POST',
      json: true,
      body: {
        url: url
      }
    };

    request(options, function(err, res, body) {
      if (!(/^2/).test(res.status)) return promise.reject(body);

      promise.resolve(body);
    });

    return promise;
  },

  createPage: function(info) {
     var Page = Parse.Object.extend('Page');
     var page = new Page();
     var user = this.state.user;

     page.set('url', info.url);
     page.set('title', info.title);
     page.set('summary', info.description);
     page.set('text', info.text);
     page.set('user', user);

     return page.save();
  },

  enabled: function() {
    return this.state.user && this.state.user.id;
  },

  render: function() {
    var active  = this.state.active ? 'active' : null;
    var error   = this.state.error ? 'error' : null;
    var loading = this.state.loading ? 'loading' : null;
    var cname   = ['add-page', active, loading].join(' ');
    var msgcn   = ['message', error].join(' ');

    return (
      <div className={ cname }>
        <div className="loader"></div>
        <div className="action add" onClick={ this.activate }>+</div>
        <form className="form" action="/" onSubmit={ this.handleSubmit }>
          <div className="close" onClick={ this.deactivate }>x</div>
          <div className={ msgcn }>{ this.state.message }</div>
          <input type="text" autoFocus className="url" ref="url" placeholder="example.com" />
          <button type="submit" className="save">Save</button>
        </form>
      </div>
    );
  }

});

module.exports = AddPage;
