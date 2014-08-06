/** @jsx React.DOM */
var React   = require('react');
var Parse   = require('parse');
var moment  = require('moment');
var url     = require('url');
var request = require('browser-request');

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

  setPage: function(page) {
    this.setState({ page: page, loading: false }, this.getImages);
  },

  getImages: function() {
    var images = this.state.page.get('images');
    var image  = images && images.small;
    var id     = this.state.page.id;
    var self   = this;
    var opts   = {
       url: 'http://trovelet.herokuapp.com/screenshot/' + id,
       json: true
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
    var page = this.state.page;

    page.set('images', images);
    this.setState({ page: page, imgLoading: false }, this.forceUpdate);
  },

  imageLoad: function() {
    this.setState({ imgLoading: false });
  },

  image: function() {
    var images  = this.state.page.get('images');
    var image   = images && images.small;
    var loading = this.state.imgLoading ? 'loading' : null;
    var cname   = ['screenshot', loading].join(' ');

    return <img src={image} className={ cname } onLoad={ this.imageLoad } />
  },

  render: function() {
    var page    = this.state.page;
    var date    = page.updatedAt ? moment(page.updatedAt).calendar() : null;
    var link    = page.get('url');
    var domain  = link ? url.parse(link).hostname.replace('www.', '') : null;
    var image   = this.state.page.get('images')
    var loading = this.state.loading ? 'loading' : null;
    var cname   = ['page-item', loading].join(' ');


    return (
      <div key={ this.props.key } className={ cname }>
        <div className="preview">
          { this.image() }
        </div>
        <a href={ link } target="_blank" className="title">
          { page.get('title') }
        </a>
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
