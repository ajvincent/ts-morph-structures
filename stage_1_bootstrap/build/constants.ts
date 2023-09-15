import {
  type ModuleSourceDirectory,
  pathToModule,
} from "#utilities/source/AsyncSpecModules.js";

export const stageDir: ModuleSourceDirectory = {
  importMeta: import.meta,
  pathToDirectory: "../.."
};

const sourceGeneratedDir = pathToModule(stageDir, "source/generated");

export {
  sourceGeneratedDir,
};
