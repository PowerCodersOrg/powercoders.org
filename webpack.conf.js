const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "production",
  entry: {
    app: "./src/js/app.js",
    cms: "./src/js/cms.js"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/",
    filename: "[name].js"
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    }
  },
  performance: {
    hints: false
  },
  resolve: {
    modules: ["node_modules"]
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /app\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "eslint-loader"
      },
      {
	test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
	loader: "file-loader?name=/[hash].[ext]"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "env"
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      fetch: "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
    })
  ],
  externals: {
    jquery: "jQuery"
  }
};
