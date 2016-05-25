module.exports = {
  context: __dirname,
  entry: "./lib/entry.js",
  output: {
    filename: "./lib/bundle.js"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  devtool: 'source-maps'
};
