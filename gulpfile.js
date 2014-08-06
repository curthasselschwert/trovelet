var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var plugins = require('gulp-load-plugins')();

gulp.task("images", function() {
  return gulp.src('src/images/**/*')
           .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('scss', function() {
  return gulp.src('src/scss/app.scss')
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer('last 3 versions'))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('dist/assets'));
});

gulp.task("html", function() {
  return gulp.src('src/html/**/*')
           .pipe(gulp.dest('dist'));
});

gulp.task('server', function() {
  plugins.nodemon({ script: 'server.js', ext: 'js', ignore: ['src/**/*', 'dist/**/*'] })
    .on('restart', function(files) {
      gutil.log('[nodemon]', 'nodemon reloading...', files)
    })
    .on('crash', function() {
      gutil.log('[nodemon]', 'nodemon crashed...')
    });
});

gulp.task('dev', ['server', 'html', 'images', 'scss'], function() {
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/html/**/*', ['html']);
  gulp.watch('src/scss/app.scss', ['scss']);
});

gulp.task("webpack:build", function(callback) {
  // TODO: Not sure how to disable the dev server entry points
  webpackConfig.entry = ['./src/js/app'];

  // modify some webpack config options
  var config = Object.create(webpackConfig);

  config.plugins = config.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(config, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);

    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));

    callback();
  });
});

gulp.task('build', ['webpack:build', 'images', 'scss', 'html']);
