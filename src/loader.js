const cheerio = require('cheerio');
const { FILENAME_REPLACE_STRING } = require('./constants');

// TODO(Jeremy):
// Does svg-sprite-loader have sourcemap support? If so, can we proxy/preserve
// those sourcemaps?
module.exports = function IconLoader(source) {
  // eslint-disable-next-line no-unused-expressions
  this.cacheable && this.cacheable();

  const plugin = this.iconPlugin;

  // The <symbol> to extract
  const text = this.exec(source, this.resource);
  const id = cheerio(text).attr('id');

  // Instead of exporting the SVG <symbol>, we just want to export the path to
  // the icon. We're using a string for the filename that will be replaced by
  // the plugin once all of the icons are extracted and we know the hash.
  const replacedExports = `${FILENAME_REPLACE_STRING}#${id}`;

  // Inform the plugin of the <symbol> that goes with this ID.
  // I'm relying on svg-sprite-loader to make sure these IDs are unique.
  // If we later find bugs around the wrong icon showing up, it's their fault,
  // not mine :)
  plugin.register(id, text);

  const output = [
    `module.exports = ${JSON.stringify(replacedExports)}`,
    '// ----- Content replaced/extracted by IconPlugin ----- //',
  ];

  return output.join('\n');
};
