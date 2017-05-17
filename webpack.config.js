/*
 * @author alikr
 */

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const browsers = ['ie 6-8','Firefox < 20','Android > 2.1'];
const config = {
  entry: {
    'index': ['./src/app/index'],
    'lib':['vue','vue-router','vuex']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].js',
    publicPath: './'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'index',
      template: path.join(__dirname, '/src/index.html'),
      filename: path.join(__dirname, '/dist/index.html'),
      excludeChunks: [],
      inject: true,
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      disable: false,
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: "lib",
        minChunks: Infinity,
        filename: "js/lib.js",
        warning: false
    }),

    new CopyWebpackPlugin([
    {
      from: 'src/resources/data/',
      to: 'data'
    }],
    {
      copyUnmodified: false
    })
  ],
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: ExtractTextPlugin.extract({
            fallback: 'vue-style-loader',
            use: 'css-loader'
          }),
          js: {
            loader: 'babel-loader'
          }
        }
      }
    },
    {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
        {
            loader:'css-loader'
        },{
            loader:'autoprefixer-loader',
            options:{
                browsers:browsers
            }
        },{
            loader:'less-loader'
        }]
      })
    },
    {
      test: /\.(js|es6)$/,
      loader: 'babel-loader',
      exclude: /node_module/
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
        {
            loader:'css-loader'
        },{
            loader:'autoprefixer-loader',
            options:{
                browsers:browsers
            }
        }]
      })
    }, {
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader',
      options: {
        limit: 10,
        name: "img/[name].[ext]?[hash:8]",
        publicPath: '../'
      }
    },
    {
      test: /\.((eot|ttf|otf|woff|woff2|svg)(\?.*)?)$/,
      loader: "url-loader",
      options: {
        limit: 1,
        name: 'fonts/[name].[ext]',
        publicPath: '../'
      }
    }, ]
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ],
    alias: {
      '_vuex': path.resolve(__dirname, "./src/vuex"),
      'lib': path.resolve(__dirname, "./src/lib")
    }
  }
}

module.exports = config
