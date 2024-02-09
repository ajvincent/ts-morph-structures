import pkg from 'typescript';
const {  ModuleKind, ModuleResolutionKind, ScriptTarget } = pkg;

import ts_plugin from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const compilerOptions = {
  "lib": ["lib.es2023.d.ts"],
  "module": ModuleKind.ES2022,
  "target": ScriptTarget.ES2022,
  "moduleResolution": ModuleResolutionKind.Bundler,

  "baseUrl": ".",

  "strict": true,
  "esModuleInterop": true,
  "skipLibCheck": true,
  "forceConsistentCasingInFileNames": true,
};

export default [
  {
    input: "./source/exports.ts",
    output: {
      dir: "./dist",
      format: "es"
    },
    plugins: [
      ts_plugin(
        {
          "compilerOptions": {...compilerOptions},
        }
      ),
    ],
  },

  {
    input: "./source/exports.ts",
    output: {
      dir: "./dist",
      format: "es"
    },
    plugins: [
      dts(
        {
          "compilerOptions": {...compilerOptions},
        }
      ),
    ],
  },
];
