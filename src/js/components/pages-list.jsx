/** @jsx React.DOM */
var React   = require('react');
var Parse   = require('parse');
var emitter = require('../emitter');
var url     = require('url');
var moment  = require('moment');

var PagesList = React.createClass({

  getInitialState: function() {
    return { pages: [], error: {}, limit: 5, count: 0, page: 1 };
  },

  componentDidMount: function() {
    emitter.on('page added', this.pageAdded);
    this.updateList();
  },

  getPages: function() {
    var Page   = Parse.Object.extend('Page');
    var query  = new Parse.Query(Page);
    var user   = this.props.user;
    var limit  = this.state.limit;
    var offset = (this.state.page - 1) * this.state.limit;

    if (user && user.id) {
      query.equalTo('user', user);
      query.descending('updatedAt');
      query.limit(limit);
      query.skip(offset);
      query.find()
        .then(this.handleSuccess, this.handleError);
    }
  },

  handleSuccess: function(pages) {
    this.setState({ pages: pages });
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
      return (
        <div className="pagination next" onClick={ this.setPage.bind(this, next) }>
          Next
        </div>
      )
    }
  },

  prevPage: function() {
    var more = this.state.page > 1;
    var prev = this.state.page - 1;

    if (more) {
      return (
        <div className="pagination prev" onClick={ this.setPage.bind(this, prev) }>
          Prev
        </div>
      )
    }
  },

  pages: function() {
    return this.state.pages.map(function(page) {
      var date = moment(page.updatedAt).calendar();

      return (
        <tr key={ page.id } className="page">
          <td>
            <a href={ page.get('url') } target="_blank">{ page.get('title') }</a>
          </td>
          <td>
            { page.get('summary') }
          </td>
          <td>
            { url.parse(page.get('url')).hostname }
          </td>
          <td>
            { date }
          </td>
        </tr>
      );
    });
  },

  render: function() {
    return (
      <div className="pages-list">
        <table className="pages">
          { this.pages() }
          <tfoot>
            <tr>
              <td colSpan="2">
                { this.prevPage() }
              </td>
              <td colSpan="2">
                { this.nextPage() }
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }

});

module.exports = PagesList;
