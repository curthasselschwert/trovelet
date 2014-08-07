/** @jsx React.DOM */
var React   = require('react');
var emitter = require('../emitter');

var DeletePage = React.createClass({

  handleClick: function(e) {
    e.stopPropagation();
    var page = this.props.page;

    page.destroy()
      .then(this.handleSuccess, this.handleError);
  },

  handleSuccess: function() {
    emitter.emit('page deleted');
  },

  handleError: function(error) {
    console.log('Error', error);
  },

  render: function() {
    return <img src="/assets/images/delete.svg" className="action delete" onClick={ this.handleClick } />;
  }

});

module.exports = DeletePage;
