/** @jsx React.DOM */
var React      = require('react');
var Parse      = require('parse');
var DeletePage = require('./delete-page');
var moment     = require('moment');
var url        = require('url');
var request    = require('browser-request');

var PageItem = React.createClass({

  getInitialState: function() {
    var Page = Parse.Object.extend('Page');
    var page = new Page();

    return { page: page, loading: true, imgLoading: true };
  },

  componentDidMount: function() {
    var Page  = Parse.Object.extend('Page');
    var query = new Parse.Query(Page);
    var id    = this.props.id;

    query.get(id)
     .then(this.setPage);
  },

  openPage: function() {
    var url = this.state.page.get('url');
    window.open(url, '_blank');
  },

  setPage: function(page) {
    this.setState({ page: page, loading: false }, this.getImages);
  },

  getImages: function() {
    var images = this.state.page.get('screenshots');
    var image  = images && images.small;
    var id     = this.state.page.id;
    var self   = this;
    var opts   = {
       method: 'POST',
       url: '/pages/screenshot',
       json: true,
       body: {
        url: this.state.page.get('url')
       }
    };

    if (!image && id) {
      request(opts, function(err, response, images) {
        if (!err) {
          self.setImages(images);
        }
      });
    }
  },

  setImages: function(images) {
    if (this.isMounted()) {
      var page = this.state.page;

      page.set('screenshots', images);
      this.setState({ page: page });
    }
  },

  imageLoad: function() {
    var timeout = Math.floor(Math.random() * 500) + 500;

    setTimeout(this.setState.bind(this, { imgLoading: false }), timeout);
  },

  image: function() {
    var images  = this.state.page.get('screenshots');
    var image   = images && images.small;
    var loading = this.state.imgLoading ? 'loading' : null;
    var cname   = ['preview', loading].join(' ');

    return (
      <div className={ cname }>
        <img src={image} className="screenshot" onLoad={ this.imageLoad } />
      </div>
    );
  },

  summary: function() {
    var page = this.state.page;

    return page.get('summary') || page.get('text');
  },

  render: function() {
    var page    = this.state.page;
    var date    = page.updatedAt ? moment(page.updatedAt).calendar() : null;
    var link    = page.get('url');
    var domain  = link ? url.parse(link).hostname.replace('www.', '') : null;
    var image   = this.state.page.get('screenshots')
    var loading = this.state.loading ? 'loading' : null;
    var cname   = ['page-item', loading].join(' ');

    return (
      <div key={ this.props.key } className={ cname } onClick={ this.openPage }>
        { this.image() }
        <div className="page-meta">
          <h2 className="title">
            { page.get('title') }
          </h2>
          <p className="summary">
            { this.summary() }
          </p>
          <p className="domain">
            { domain }
          </p>
          <DeletePage page={ this.state.page } />
       </div>
      </div>
    );
  }

});

module.exports = PageItem;
