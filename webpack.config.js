const path = require('path');

module.exports = {
  entry: {
    'gotit-pragma-automatic': './src/gotit-pragma-automatic.js'
  },
  mode: 'production',
  experiments: {
    outputModule: true,
  },
  externalsType: 'module',
  target: ['es2020'],
  output: {
    library: {
      name: 'MUIGotit',
      type: 'var',
      export: ['default'],
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
    {
      reactDOM: 'react-dom',
    },
    /^@mui/,
    /^@emotion/,
  ]
};
