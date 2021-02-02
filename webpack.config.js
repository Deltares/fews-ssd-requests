const path = require('path')

module.exports = {
  mode: 'development',

  entry: './src/index.ts',
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
  module: {
    rules: [
      {
        // Include ts, tsx, and js files.
        test: /\.(tsx?)|(js)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
}

