// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // All copy must render in Inter; React Native's Text would silently fall back to the system font.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/Text.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react-native",
              importNames: ["Text"],
              message: "Import Text from src/components/Text so it renders in Inter.",
            },
          ],
        },
      ],
    },
  },
]);
