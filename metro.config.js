const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);
