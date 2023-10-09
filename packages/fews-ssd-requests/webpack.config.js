import * as path from 'path';
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
  mode: 'production',
  entry: './lib/esm/index.js',
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

export default config