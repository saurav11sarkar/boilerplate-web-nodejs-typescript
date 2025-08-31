// eslint.config.mjs
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.node,   // ⬅️ Node.js globals যোগ করা হলো
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "off",   // ⬅️ এটা অফ করে দাও, কারণ TypeScript + globals handle করবে
      "prefer-const": "error",
      "no-console": "off",
    },
    ignores: ["dist", "node_modules"],
  },
];
