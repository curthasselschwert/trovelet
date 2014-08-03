/** @jsx React.DOM */
var React = require('react');
var Parse = require('parse');

var PagesList = React.createClass({

  getInitialState: function() {
    return { pages: [] };
  },

  componentDidMount: function() {
    var Page  = Parse.Object.extend('Page');
    var query = new Parse.Query(Page);
    var user  = this.props.user;

    console.log('User', this.props.user);

    if (user && user.id) {
      query.equalTo('user', this.props.user);
    }

    query.find({
      success: this.loadPages
    });
  },

  pages: function() {
    return this.state.pages.map(function(page) {
      return <div className="page">{ page.attributes.title }</div>;
    });
  },

  loadPages: function(pages) {
    this.setState({ pages: pages });
  },

  render: function() {
    return (
      <div className="pages-list">
        <div>Pages List</div>
        <div className="pages">{ this.pages() }</div>
      </div>
    )
  }

});

module.exports = PagesList;
