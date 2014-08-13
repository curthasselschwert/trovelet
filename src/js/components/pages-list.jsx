/** @jsx React.DOM */
var React      = require('react');
var Parse      = require('parse');
var PageItem   = require('./page-item');
var AddPage    = require('./add-page');
var emitter    = require('../emitter');
var url        = require('url');
var moment     = require('moment');
var request    = require('browser-request');

var PagesList = React.createClass({

  getInitialState: function() {
    return {
      pages: [],
      error: {},
      api: 'http://trovelet.parseapp.com/pages/search?',
      limit: 5
    };
  },

  componentDidMount: function() {
    emitter.on('page added', this.getPages);
    emitter.on('page deleted', this.getPages.bind(this, this.state.currentUrl));

    this.getPages();
  },

  getPages: function(url) {
    if (!url) {
      url = this.state.api + ['userId=' + this.props.user.id, 'limit=' + this.state.limit].join('&');
    }

    var options = {
      url: url,
      json: true
    }

    this.setState({ currentUrl: url });

    request(options, this.handleResponse);
  },

  handleResponse: function(error, response, body) {
    if (error || !(/^2/).test(response.status)) {
      return this.setState({ error: error });
    }

    return this.setState(body);
  },

  nextPage: function() {
    var next   = this.state.next;
    var active = next ? 'active' : null;
    var cname  = ['nav', 'next', active].join(' ');
    var action = active ? this.getPages.bind(this, this.state.next) : function() {};

    return <img src="/assets/images/nav-arrow.svg" className={ cname } onClick={ action } />;
  },

  prevPage: function() {
    var prev   = this.state.prev;
    var active = prev ? 'active' : null;
    var cname  = ['nav', 'prev', active].join(' ');
    var action = active ? this.getPages.bind(this, this.state.prev) : function() {};

    return <img src="/assets/images/nav-arrow.svg" className={ cname } onClick={ action } />;
  },

  pages: function() {
    return this.state.pages.map(function(page) {
      return <PageItem key={ page.id } id={ page.id } />;
    });
  },

  addPage: function() {
    var user    = this.props.user;
    var current = Parse.User.current();

    if (user.id === current.id && this.state.page === 1) {
      return <AddPage />;
    }

    return null;
  },

  render: function() {
    return (
      <div className="pages-list">
        <div className="page-tools">
          <div className="pagination">
            { this.prevPage() }
            { this.nextPage() }
          </div>
        </div>
        <div ref="pages" className="pages">
          { this.addPage() }
          { this.pages() }
        </div>
      </div>
    )
  }

});

module.exports = PagesList;
