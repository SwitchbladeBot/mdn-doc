const path = require('path')

module.exports = {
  entry: {
    bundle: path.join(__dirname, 'src', 'index.ts')
  },

  target: 'webworker',

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },

  mode: process.env.NODE_ENV || 'production',

  watchOptions: {
    ignored: /node_modules|dist|\.js/g
  },

  devtool: 'cheap-module-source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: []
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  }
}
