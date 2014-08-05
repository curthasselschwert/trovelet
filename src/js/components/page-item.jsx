/** @jsx React.DOM */
var React  = require('react');
var Parse  = require('parse');
var moment = require('moment');
var url    = require('url');

var PageItem = React.createClass({

  getInitialState: function() {
    var Page = Parse.Object.extend('Page');
    var page = new Page();

    return { page: page, loading: true };
  },

  componentDidMount: function() {
    var Page  = Parse.Object.extend('Page');
    var query = new Parse.Query(Page);
    var id    = this.props.id;

    query.get(id)
     .then(this.setPage);
  },

  setPage: function(page) {
    this.setState({ page: page, loading: false });
  },

  title: function() {
    var loading = this.state.loading ? 'loading' : '';
    var link    = this.state.page.get('url');
    var title   = this.state.page.get('title');
    var cname   = ['title', loading].join(' ');

    return (
      <a href={ link } target="_blank" className={ cname }>
        { title }
      </a>
    )
  },

  render: function() {
    var page   = this.state.page;
    var date   = page.updatedAt ? moment(page.updatedAt).calendar() : null;
    var link   = page.get('url');
    var domain = link ? url.parse(link).hostname : null;

    return (
      <div key={ this.props.key } className="page-item">
        <div className="image">
        </div>
        { this.title() }
        <p className="summary">
          { page.get('summary') }
        </p>
        <p className="domain">
          { domain }
        </p>
      </div>
    );
  }

});

module.exports = PageItem;
