const path = require('path');

module.exports = {
  entry: {
    'index': "./src/index.js",
    'gotit-pragma-automatic': './src/gotit-pragma-automatic.js'
  },
  resolve: {
    modules: [__dirname, 'node_modules'],
  },
  mode: 'production',
  target: 'web',
  output: {
    library: {
      name: "my-var",
      type: 'var',
    },
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              [
                '@babel/preset-react',
                {
                  "runtime": "automatic" // defaults to classic
                },
              ]
            ]
          }
        }
      }
    ]
  },
  externals: [
    {
      react: 'react',
    },
    /^@mui/,
    /^@emotion/,
  ]
};
