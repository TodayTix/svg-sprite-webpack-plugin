const config = {
  DEV: false,
  SERVER: true,
  CLIENT: false,
};

module.exports = {
  /**
   * Store configuration options so that other things work correctly.
   * @param  {Object} updates
   * @param  {boolean} updates.SERVER Are we currently in a server context?
   * @param {boolean}  updates.CLIENT Are we currently in a browser context?
   * @param {boolean}  updates.DEV    Are we currently in dev mode?
   */
  updateConfig(updates = {}) {
    Object.keys(updates).forEach(key => {
      config[key] = updates[key];
    });

    // -- Some sanity checks -- //

    if ('SERVER' in updates && !('CLIENT' in updates)) {
      config.CLIENT = !config.SERVER;
    }

    if ('CLIENT' in updates && !('SERVER' in updates)) {
      config.SERVER = !config.CLIENT;
    }
  },
  default: config,
};
