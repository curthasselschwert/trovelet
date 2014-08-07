/** @jsx React.DOM */
var React      = require('react');
var Parse      = require('parse');
var PageItem   = require('./page-item');
var AddPage    = require('./add-page');
var emitter    = require('../emitter');
var url        = require('url');
var moment     = require('moment');

var PagesList = React.createClass({

  getInitialState: function() {
    return {
      pageIds: [],
      error: {},
      limit: 10,
      count: 0,
      page: 1
    };
  },

  componentDidMount: function() {
    emitter.on('page added', this.pageAdded);
    emitter.on('page deleted', this.updateList);

    var width = this.refs.pages.getDOMNode().getBoundingClientRect().width;
    var limit = Math.floor(width / 228) * 5;

    this.setState({ limit: limit }, this.updateList);
  },

  getPages: function() {
    var Page   = Parse.Object.extend('Page');
    var query  = new Parse.Query(Page);
    var user   = this.props.user;
    var limit  = this.state.limit;
    var offset = (this.state.page - 1) * this.state.limit;

    query.equalTo('user', user);
    query.descending('updatedAt');
    query.limit(limit);
    query.skip(offset);
    query.select('id');
    query.find()
      .then(this.handleSuccess, this.handleError);
  },

  handleSuccess: function(pages) {
    var ids = pages.map(function(page) { return page.id });

    this.setState({ pageIds: ids });
  },

  handleError: function(error) {
    this.setState({ error: error });
  },

  getCount: function() {
    var Page  = Parse.Object.extend('Page');
    var query = new Parse.Query(Page);
    var user  = this.props.user;

    query.equalTo('user', user);
    query.count()
      .then(this.setCount);
  },

  setCount: function(count) {
    this.setState({ count: count });
  },

  setPage: function(page) {
    this.setState({ page: page }, this.getPages);
  },

  updateList: function() {
    this.getPages();
    this.getCount();
  },

  pageAdded: function() {
    this.setState({ page: 1 }, this.updateList);
  },

  nextPage: function() {
    var more = this.state.page * this.state.limit < this.state.count;
    var next = this.state.page + 1;

    if (more) {
      return <img src="/assets/images/nav-arrow.svg" className="nav next" onClick={ this.setPage.bind(this, next) } />;
    }
  },

  prevPage: function() {
    var more = this.state.page > 1;
    var prev = this.state.page - 1;

    if (more) {
      return <img src="/assets/images/nav-arrow.svg" className="nav prev" onClick={ this.setPage.bind(this, prev) } />;
    }
  },

  pages: function() {
    return this.state.pageIds.map(function(id) {
      return <PageItem key={ id } id={ id } />;
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
        </div>
        <div ref="pages" className="pages">
          { this.addPage() }
          { this.pages() }
        </div>
        <div className="pagination">
          { this.prevPage() }
          { this.nextPage() }
        </div>
      </div>
    )
  }

});

module.exports = PagesList;
