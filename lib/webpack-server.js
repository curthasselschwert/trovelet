var server   = require("webpack-dev-server");
var webpack  = require("webpack");
var config   = require(__dirname + '/../webpack.config.js');
var compiler = webpack(config);

module.exports = new server(compiler, {
  contentBase: "http://localhost:3000",
  hot: true,
  publicPath: "http://localhost:3001/assets/",
  stats: { colors: true }
});

