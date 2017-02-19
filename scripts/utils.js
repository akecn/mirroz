import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export function getPlugins(env) {
  const isDev = env === 'development';

  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      __DEV__: isDev
    }), //Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new ExtractTextPlugin('[name].css')
  ];

  if(isDev) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    );
  }else {
    plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
    );
  }

  return plugins;
}
