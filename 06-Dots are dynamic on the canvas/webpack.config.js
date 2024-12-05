module.exports = {
  mode: 'development',
  entry: {
    code: './code.js',
    ui: './ui.html'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader']
      }
    ]
  },
  output: {
    filename: '[name].js'
  }
}; 