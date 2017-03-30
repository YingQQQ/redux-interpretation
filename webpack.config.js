const weboack = require('webpack');
const {
  resolve
} = require('path');
const {
  CheckerPlugin
} = require('awesome-typescript-loader');

const config = {
  devtool: 'source-map',
  entry: resolve(__dirname, 'src/index.tsx'),
  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"]
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: 'awesome-typescript-loader'
    }]
  },
  plugins: [
      new CheckerPlugin()
  ]
}

module.exports = config;
