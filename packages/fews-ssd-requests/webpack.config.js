const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: { 
      name: 'fews-ssd-requests',
      type: 'umd'
    },
    filename: 'fews-ssd-requests.umd.js',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
  ],
  module: {
  },
}