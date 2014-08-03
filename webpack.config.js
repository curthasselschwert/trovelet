var path    = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    "webpack-dev-server/client?http://localhost:8080",
    "webpack/hot/dev-server",
    "./src/js/app"
  ],
  output: {
    path: __dirname + "/dist/assets",
    filename: "bundle.js",
    publicPath: "/assets"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: "style!css!autoprefixer?browsers=last 3 versions!sass?includePaths[]" + path.resolve(__dirname, './src/')
      },
      {
        test: /\.jsx$/,
        loader: 'react-hot!jsx'
      }
    ]
  },
  externals: {
    "parse": "Parse"
  }
}
