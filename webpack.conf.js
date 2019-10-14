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
              "@babel/preset-env"
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
      },
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        }, {
          loader: 'expose-loader',
          options: '$'
        }]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      // See https://github.com/github/fetch/issues/659
      fetch: "exports-loader?self.fetch!whatwg-fetch/dist/fetch.umd"
    })
  ],
};
