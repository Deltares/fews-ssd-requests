const path = require('path')

module.exports = {
  mode: 'production',
  entry: './lib/esm/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    library: 'fews-pi-requests',
    libraryTarget: 'umd',
    filename: 'fews-pi-requests.umd.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
  ],
}