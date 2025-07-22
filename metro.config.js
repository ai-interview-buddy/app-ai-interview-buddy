const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // zustand had an issue while running on web, uppon fix, this may be removed
  // to test: just do login and see if the 'session' is stored and no error is seen: Cannot use 'import.meta' outside a module
  // https://github.com/pmndrs/zustand/discussions/1967
  if (moduleName.includes("zustand")) {
    const result = require.resolve(moduleName);
    return context.resolveRequest(context, result, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
