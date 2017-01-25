const config = require('./config').default;

if (config.DEV) {

  /*
   * In dev mode, we're not using the custom icon loader that extracts
   * everything into a single SVG file. Instead, we'll just use the
   * svg-sprite-loader as-is, with only this slight tweak on how the sprite is
   * handled to account for server-side rendering.
   */
  if (config.CLIENT) {
    module.exports = require('svg-sprite-loader/lib/web/global-sprite');
  } else if (config.SERVER) {
    module.exports = require('svg-sprite-loader/lib/server-side-sprite');
  }
}
