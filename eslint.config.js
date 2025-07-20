export default tseslint.config(
  {
    ignores: ["dist", "**/*.ts", "**/*.tsx"],
  },
  {
    extends: [js.configs.recommended],
    files: ["**/*.js", "**/*.jsx"], // or just don't specify this block
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);
