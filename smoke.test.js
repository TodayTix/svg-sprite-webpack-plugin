const test = require('ava');
const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');

const IconPlugin = require('./').plugin;

const OUTPUT_PATH = path.resolve(__dirname, './smoke-test-output');

test.afterEach.always(() => new Promise(res => {
  // Clean up after ourselves
  rimraf(OUTPUT_PATH, res);
}));

test.cb(t => {
  t.plan(1);

  const iconPlugin = new IconPlugin('icons-[hash].svg');

  webpack({
    output: {
      filename: 'bundle.js',
      path: OUTPUT_PATH,
    },
    entry: './fixtures/entry.js',
    module: {
      loaders: [
        {
          test: /\.svg$/,
          loader: iconPlugin.extract(),
        },
      ],
    },
    plugins: [
      iconPlugin,
    ],
  }, () => {
    try {
      require(path.join(OUTPUT_PATH, 'bundle.js'));
    } catch (e) {
      t.fail('An exception was thrown when requiring bundle.js');
    }

    // The actual test... See if the icon string placed in the global scope by
    // the entry script looks like it should.
    // It should be /static/icons-[hash].svg#icon, with [hash] being a hex
    // encoding of some sort, since the icon was in a file named icon.svg.
    t.regex(global.icon, /^\/static\/icons-[a-f0-9]+\.svg#icon$/);

    t.end();
  });
});
