const {
  withAndroidManifest,
  withAppBuildGradle,
  AndroidConfig,
} = require("@expo/config-plugins");

// --- Add play-services-auth dependency to app/build.gradle ---
const withPlayServicesAuth = (config) => {
  return withAppBuildGradle(config, (config) => {
    const dependency =
      'implementation("com.google.android.gms:play-services-auth:20.7.0")';

    if (!config.modResults.contents.includes(dependency)) {
      // Insert before the closing brace of the dependencies block
      config.modResults.contents = config.modResults.contents.replace(
        /dependencies\s*\{([\s\S]*?)\n\}/,
        (match, inner) => {
          return `dependencies {${inner}\n    ${dependency}\n}`;
        }
      );
    }

    return config;
  });
};

const withForegroundServiceAndDeduplication = (config) => {
  // First apply the build.gradle modification
  config = withPlayServicesAuth(config);

  // Then apply the manifest modifications
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults;

    if (!manifest.manifest.$["xmlns:tools"]) {
      manifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
    }

    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);

    // --- Deduplicate <service> entries and ensure ForegroundService exists ---
    mainApplication["service"] = mainApplication["service"] || [];

    const serviceName = "app.notifee.core.ForegroundService";
    const existingIndex = mainApplication["service"].findIndex(
      (s) => s.$?.["android:name"] === serviceName
    );

    const serviceEntry = {
      $: {
        "android:name": serviceName,
        "android:foregroundServiceType": "microphone|dataSync",
        "tools:replace": "android:foregroundServiceType",
      },
    };

    if (existingIndex >= 0) {
      // Replace in-place instead of adding a duplicate
      mainApplication["service"][existingIndex] = serviceEntry;
    } else {
      mainApplication["service"].push(serviceEntry);
    }

    // --- Deduplicate <uses-permission> entries ---
    if (manifest.manifest["uses-permission"]) {
      const seen = new Set();
      manifest.manifest["uses-permission"] = manifest.manifest[
        "uses-permission"
      ].filter((perm) => {
        const name = perm.$?.["android:name"];
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      });
    }

    return config;
  });
};

module.exports = withForegroundServiceAndDeduplication;
