// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

import {
  projectDir,
} from "#utilities/source/AsyncSpecModules.js";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: projectDir
      }
    }
  },
  {
    "rules": {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "all",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "all",
          "destructuredArrayIgnorePattern": "all",
          "varsIgnorePattern": "Key$",
          "ignoreRestSiblings": true
        },
      ],
    },
  },
  {
    "files": ["snapshot/dist/exports.d.ts"],
    "rules": {
      // #private
      "no-unused-private-class-members": [
        "off",
      ]
    }
  }
);
