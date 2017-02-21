import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';

import {getPlugins} from './scripts/utils';

const env = process.env.NODE_ENV || 'production';

export default {
  noInfo: true,
  devtool: 'cheap-module-source-map',
  entry: {
    'index': "./src/index.js"
  },
  output: {
    path: "build",
    filename: "[name].js"
  },
  plugins: getPlugins(env),
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel" },
      {test: /(\.css|\.less)$/, loader: ExtractTextPlugin.extract(`css!postcss!less`)}
    ]
  },
  postcss: function () {
    return [autoprefixer];
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};
