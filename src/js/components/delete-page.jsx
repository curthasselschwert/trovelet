/** @jsx React.DOM */
var React   = require('react');
var emitter = require('../emitter');

var DeletePage = React.createClass({

  handleClick: function() {
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
    return <div className="action delete" onClick={ this.handleClick }>Delete</div>;
  }

});

module.exports = DeletePage;
