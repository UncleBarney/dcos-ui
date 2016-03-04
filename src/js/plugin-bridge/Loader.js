// Provide webpack contexts for smarter build. Without these,
// webpack will try to be smart and auto create the contexts,
// doubling the built output
const requirePlugin = require.context('../../../plugins', true, /index/);
const requireConfig = require.context('../config', false);
const requireEvents = require.context('../events', false);
const requireStructs = require.context('../structs', false);
const requireUtils = require.context('../utils', false);
const requireMixins = require.context('../mixins', false);
const requireComponents = require.context('../components', false);
const requireIcons = require.context('../components/icons', false);
const requireModals = require.context('../components/modals', false);

let pluginsList;

// Try loading the list of plugins.
try {
  pluginsList = require('../../../plugins/index');
} catch(err) {
  // No plugins
  pluginsList = {};
}

// Return all available plugins
function getAvailablePlugins() {
  return pluginsList;
}

/**
 * Removes a part of a filepath
 * @param  {Array} dirs    - Array of directories representing the path to a file
 * @param  {Int} atIndex - Index of directory to remove
 * @return {String}         - New path to file
 */
function removeDir(dirs, atIndex) {
  dirs.splice(atIndex, 1);
  return dirs.join('/');
}

/**
 * Finds component within subdirectories of components/
 * @param  {String} path - Path to module
 * @return {module}      - result of require
 */
function pluckComponent(path) {
  let dirs = path.split('/');
  switch (dirs[1]) {
    case 'icons':
      return requireIcons(removeDir(dirs, 1));
    case 'modals':
      return requireModals(removeDir(dirs, 1));
    default:
      return requireComponents(path);
  }
}

/**
 * Dynamic require of module with base directory and name
 * @param  {String} dir  - base directory of module
 * @param  {String} name - name of module
 * @return {module}      - result of require
 */
function requireModule(dir, name) {
  let path = './' + name;
  switch (dir) {
    case 'config':
      return requireConfig(path);
    case 'events':
      return requireEvents(path);
    case 'structs':
      return requireStructs(path);
    case 'utils':
      return requireUtils(path);
    case 'mixins':
      return requireMixins(path);
    case 'components':
      return pluckComponent(path);
    case 'plugins':
      return requirePlugin(path);
    default:
      throw Error('No loader for directory');
  }
}

module.exports = {
  getAvailablePlugins,
  requireModule
};