var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require("./webpack.config.js");
var compiler = webpack(config);
config.entry.index.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");

var server = new WebpackDevServer(compiler, {
  contentBase: "dist",
  hot: true,
  inline: true,
  historyApiFallback: false,
  compress: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  watchContentBase: true,
  stats: {
    colors: true,
    children: false

  }
});
server.listen(8080, "localhost", function() {});
