'use strict';
const path              = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'application.js',
    publicPath: '/'
  },

  cache:   true,
  debug:   true,
  devtool: 'inline-source-map',

  entry: [
    path.resolve(__dirname, 'app', 'main.js')
    //'webpack-dev-server/client?http://0.0.0.0:3001', // WebpackDevServer host and port
    //'webpack/hot/only-dev-server'
  ],

  plugins: [
    new ExtractTextPlugin("application.css")
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel'],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      },
      {
        test: /\.(woff|woff2)$/,
        loader: "url?prefix=font/&limit=5000"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      },
      {
        test: /\.gif/,
        loader: "url-loader?limit=10000&mimetype=image/gif"
      },
      {
        test: /\.jpg/,
        loader: "url-loader?limit=10000&mimetype=image/jpg"
      },
      {
        test: /\.png/,
        loader: "url-loader?limit=10000&mimetype=image/png"
      }
    ]
  },

  devServer: {
    proxy: {
      "/api*": "http://localhost:3000"
    }
  }
}
