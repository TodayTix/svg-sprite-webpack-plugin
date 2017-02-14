const crypto = require('crypto');
const isEmpty = require('lodash.isempty');
const reduce = require('lodash.reduce');
const values = require('lodash.values');
const { RawSource, ReplaceSource } = require('webpack-sources');
const { FILENAME_REPLACE_STRING } = require('./constants');

/**
 * Takes a source, and a string to replace, and returns a ReplaceSource with
 * all the instances of that string replaced.
 * @param  {Source} source The original source
 * @param  {string} name   ReplaceSource has a `name` param in its constructor.
 *                         I don't actually know why.
 * @param  {string} oldStr The string to be replaced
 * @param  {string} newStr The string to replace it with
 * @return {ReplaceSource} A Source object with all of the replacements applied
 */
function replaceAll(source, name, oldStr, newStr) {
  const transformedSource = new ReplaceSource(source, name);
  const reTester = new RegExp(oldStr, 'g');
  let reResult = reTester.exec(source.source());

  if (reResult == null) {
    return source;
  }

  while (reResult != null) {
    transformedSource.replace(
      reResult.index,
      reTester.lastIndex - 1,
      newStr
    );

    reResult = reTester.exec(source.source());
  }

  return transformedSource;
}

module.exports = class IconPlugin {
  constructor(filename) {
    this.filenameTemplate = filename;
    this.icons = {};
  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('normal-module-loader', (loaderContext) => {
        // Give the loader access to this plugin so it can register its icon
        loaderContext.iconPlugin = this;
      });

      // Replace all instances of FILENAME_REPLACE_STRING with the actual
      // filename, since by the time we get to optimize-chunk-assets, we have
      // all of the icons and can generate the correct hash for the filename.
      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
        if (isEmpty(this.icons)) {
          callback();
          return;
        }

        chunks.forEach((chunk) => {
          chunk.files.forEach((name) => {
            compilation.assets[name] = replaceAll(
              compilation.assets[name],
              name,
              FILENAME_REPLACE_STRING,

              // NOTE(Jeremy):
              // I would've just used compiled.options.output.publicPath here,
              // but apparently <use> tags don't yet support cross-origin
              // requests. This should be made configurable.
              `/static/${this.getFilename()}`
            );
          });
        });
        callback();
      });

      // Output the actual icons SVG file with all the extracted <symbol>s.
      compilation.plugin('additional-assets', (callback) => {
        if (isEmpty(this.icons)) {
          // No icons, no asset to output, nothing to do here.
          callback();
          return;
        }

        const source = `<svg xmlns="http://www.w3.org/2000/svg">${reduce(
          this.icons,
          (acc, text) => `${acc}${text}`,
          ''
        )}</svg>`;

        compilation.assets[this.getFilename()] = new RawSource(source);

        callback();
      });
    });
  }

  extract() {
    return [
      require.resolve('./loader'),
      // TODO(Jeremy):
      // SVGO loader to optimize assets, or allow passing in a loader.
      'svg-sprite-loader?extract=true',
    ].join('!');
  }

  register(id, text) {
    this.icons[id] = text;
  }

  getFilename() {
    // TODO(Jeremy): Figure out the right way to do this with Webpack built-ins.
    const md5sum = crypto.createHash('md5');
    return this.filenameTemplate.replace(
      '[hash]',
      // NOTE(Jeremy):
      // Leave this as a hex encoding. Base64 sometimes includes slashes, which
      // are no bueno in filenames (at least, without additional escaping).
      md5sum.update(values(this.icons).join('\n')).digest('hex')
    );
  }
};
