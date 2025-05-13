// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');

// This is the new line you should add in, after the previous lines
config.resolver.unstable_enablePackageExports = false;
// Example: Add custom extensions, asset plugins, etc.
// config.resolver.assetExts.push('db');
// config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

module.exports = config;
