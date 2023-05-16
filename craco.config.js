const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  webpack: {
    plugins: {
      add: [new NodePolyfillPlugin()],
    },
  },
};
