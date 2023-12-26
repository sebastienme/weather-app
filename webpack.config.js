const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images', // Correct outputPath to be relative to 'docs'
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader'],
      },
    ],
  },
};
