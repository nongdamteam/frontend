const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const { resolver: { sourceExts } } = defaultConfig;

const config = {
  resolver: {
    // Explicitly enforce Metro resolving ts, tsx, js, jsx and json
    sourceExts: [...new Set([...sourceExts, 'ts', 'tsx', 'js', 'jsx', 'json'])],
  },
};

module.exports = mergeConfig(defaultConfig, config);
