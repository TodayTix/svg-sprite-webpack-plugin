const { updateConfig } = require('./src/config');
const devSpriteModule = require('./src/dev-sprite-module');
const plugin = require('./src/plugin');
const webpackIsomorphicParser = require('./src/webpack-isomorphic-parser');

module.exports = {
  devSpriteModule,
  plugin,
  updateConfig,
  webpackIsomorphicParser,
};
