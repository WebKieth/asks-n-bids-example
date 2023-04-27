const webpack = require('webpack')

module.exports = {
  webpack: {
    configure: {
      resolve: {
        alias: {
          process: "process/browser",
        },
        fallback: {
          fs: false,
          path: false,
          os: false,
          // path: require.resolve("path-browserify"),
          crypto: require.resolve("crypto-browserify"),
          stream: false,
          zlib: require.resolve("browserify-zlib"),
          https: require.resolve("https-browserify"),
          http: require.resolve("stream-http"),
          buffer: require.resolve("buffer"),
          // os: require.resolve("os-browserify/browser"),
        },
      },
      
    },
    plugins: [
      new webpack.ProvidePlugin({
          process: 'process/browser',
      }),
      new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
      }),
    ]
  },
};