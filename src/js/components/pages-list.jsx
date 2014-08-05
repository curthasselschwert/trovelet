/** @jsx React.DOM */
var React   = require('react');
var Parse   = require('parse');
var emitter = require('../emitter');
var url     = require('url');
var moment  = require('moment');

var PagesList = React.createClass({

  getInitialState: function() {
    return { pages: [], error: {} };
  },

  componentDidMount: function() {
    emitter.on('page added', this.getPages);
    this.getPages();
  },

  getPages: function() {
    var Page  = Parse.Object.extend('Page');
    var query = new Parse.Query(Page);
    var user  = this.props.user;

    if (user && user.id) {
      query.equalTo('user', this.props.user);
      query.descending('updatedAt');
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

  pages: function() {
    return this.state.pages.map(function(page) {
      var date = moment(page.updatedAt).calendar();

      return (
        <tr key={ page.id } className="page">
          <td>
            <a href={ page.get('url') } target="_blank">{ page.get('title') }</a>
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
        <table className="pages">{ this.pages() }</table>
      </div>
    )
  }

});

module.exports = PagesList;
