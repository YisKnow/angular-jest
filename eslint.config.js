// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const sonarJSPlugin = require('eslint-plugin-sonarjs');
const eslintPluginUnicorn = require('eslint-plugin-unicorn').default;
const globals = require('globals');

module.exports = tseslint.config(
  {
    extends: [
      {
        ignores: ['node_modules', 'dist', 'public', '.angular']
      }
    ],
  },
  {
    files: ["**/*.ts"],
    ignores: ["*.spec.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      eslintPluginPrettierRecommended
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      sonarjs: sonarJSPlugin,
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "unicorn/no-null": 0,
      "unicorn/no-array-callback-reference": 0,
      "unicorn/prevent-abbreviations": 0,
      "unicorn/prefer-module": 0,
      "unicorn/filename-case": 0,
      "unicorn/consistent-function-scoping": 0,
      "unicorn/prefer-event-target": 0,
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/label-has-associated-control": "off",
    },
  }
);
