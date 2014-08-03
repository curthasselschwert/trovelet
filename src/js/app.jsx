/** @jsx React.DOM */
var React  = require('react');
var Parse  = require('parse');
var router = require('./router');

Parse.initialize("G0SMfpEtMT4TEw3yiY0mC0ogtoWIB9TpwUXjvYmo", "BQG7WVzGYG86pvb7Q5v5ObWEp7VAVjTPwwSiZfeN");

window.addEventListener('load', function() {
  router();
});
