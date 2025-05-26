const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  ...defaultConfig.resolver.extraNodeModules,
  'react-native-keyboard-controller': path.resolve(__dirname, './shim/react-native-keyboard-controller.js'),
};

module.exports = defaultConfig;