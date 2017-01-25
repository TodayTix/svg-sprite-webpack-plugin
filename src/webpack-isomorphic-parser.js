const find = require('lodash.find');
const { FILENAME_REPLACE_STRING } = require('./constants');

/**
 * Regular expression that should match the filename of the icons sprite SVG.
 * That filename is generated from the IconPlugin instance created in the
 * webpack config.
 * @type {RegExp}
 */
const iconsFileRE = /icons-[a-f0-9]+\.svg/i;

/**
 * The icon loader temporarily has FILENAME_REPLACE_STRING as a placeholder
 * filename until the actual icons file is finished, and has a hash. The
 * IconPlugin does the job of replacing it with the actual filename in the
 * generated js file, but for server-side loading we need to replicate that
 * functionality here.
 * @type {RegExp}
 */
const iconsReplaceRE = new RegExp(FILENAME_REPLACE_STRING, 'g');

module.exports = (module, options) => {
  // NOTE(Jeremy):
  // We're replicating the functionality of the plugin's string replace
  // here, because server-side doesn't use the js file that IconPlugin
  // transformed. The only way I could figure out to know the generated
  // filename was to test all of the generated assets against a regex.
  // This is clunky, and a little bit brittle, but it works.

  const iconAsset = find(options.webpack_stats.assets, asset =>
    iconsFileRE.test(asset.name)
  );
  if (iconAsset == null) {
    return module.source;
  }

  // NOTE(Jeremy):
  // Ideally, this replace would happen inside IconPlugin, but I couldn't
  // find a way to tie into it from here. Maybe someday we can revisit
  // this and clean it up a bit, because I consider this bit of logic to
  // be the least open-source-friendly part of this package.
  return module.source.replace(
    iconsReplaceRE,
    `/static/${iconAsset.name}`
  );
};
