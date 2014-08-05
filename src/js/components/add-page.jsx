/** @jsx React.DOM */
var React   = require('react');
var Parse   = require('parse');
var request = require('browser-request');
var emitter = require('../emitter');

var AddPage = React.createClass({

  getInitialState: function() {
    var user = Parse.User.current();

    return { user: user, error: {} };
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var url = this.refs.url.getDOMNode().value.trim();

    this.getInfo(url)
      .then(this.createPage, this.handleError)
      .then(this.handleSuccess, this.handleError);
  },

  handleSuccess: function(page) {
    emitter.emit('page added');
    this.refs.url.getDOMNode().value = null;
  },

  handleError: function(error) {
    this.setState({ error: error });
  },

  getInfo: function(url) {
    var promise = new Parse.Promise();

    request({ url: 'http://trovelet.herokuapp.com/info/' + url, json: true }, function(err, res, body) {
      if (err) return promise.reject(body);

      return promise.resolve(body);
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
    return (
      <div className="add-page">
        <div className="message error">{ this.state.error.message }</div>
        <form className="form" action="/" onSubmit={ this.handleSubmit }>
          <input type="text" ref="url"  enabled={ this.enabled() } placeholder="http://example.com" />
          <button type="submit" enabled={ this.enabled() }>Add Link</button>
        </form>
      </div>
    );
  }

});

module.exports = AddPage;
