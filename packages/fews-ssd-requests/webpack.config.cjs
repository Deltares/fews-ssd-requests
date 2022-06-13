const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/esm/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'fews-ssd-requests',
    libraryTarget: 'umd',
    filename: 'fews-ssd-requests.umd.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
  ],
}