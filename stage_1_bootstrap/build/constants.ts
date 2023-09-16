import {
  type ModuleSourceDirectory,
} from "#utilities/source/AsyncSpecModules.js";

const stageDir: ModuleSourceDirectory = {
  importMeta: import.meta,
  pathToDirectory: "../.."
};

export {
  stageDir,
};
