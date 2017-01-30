const test = require('ava').default;
const sinon = require('sinon');

const IconLoader = require('./loader');
const { FILENAME_REPLACE_STRING } = require('./constants');

const noop = () => {};

test.beforeEach(t => {
  const plugin = {
    register: sinon.spy(),
  };

  const webpackContext = {
    cacheable: noop,
    // eslint-disable-next-line no-eval
    exec: (code) => eval(code),
    iconPlugin: plugin,
    resource: 'filename',
  };

  t.context.loader = IconLoader.bind(webpackContext);
  t.context.plugin = plugin;
});

test('ID is extracted from the input symbol', t => {
  const source = `module.exports = '<symbol id="test"></symbol>';`;
  const output = t.context.loader(source);

  // eslint-disable-next-line no-eval
  t.is(eval(output), `${FILENAME_REPLACE_STRING}#test`);
});

test('Icon is registered with the plugin', t => {
  const source = `module.exports = '<symbol id="test"></symbol>';`;
  t.context.loader(source);

  t.true(t.context.plugin.register.calledOnce);

  // Using deepEqual instead of just looking at Sinon's calledWith gives us a
  // nicer error UI if it fails.
  t.deepEqual(t.context.plugin.register.args[0], [
    'test',
    '<symbol id="test"></symbol>',
  ]);
});
