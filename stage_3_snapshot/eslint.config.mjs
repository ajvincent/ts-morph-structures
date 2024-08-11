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
);
