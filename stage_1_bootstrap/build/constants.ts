import {
  type ModuleSourceDirectory,
} from "#utilities/source/AsyncSpecModules.js";

const projectDir: ModuleSourceDirectory = {
  importMeta: import.meta,
  pathToDirectory: "../../.."
};

const stageDir: ModuleSourceDirectory = {
  importMeta: import.meta,
  pathToDirectory: "../.."
};

export {
  projectDir,
  stageDir,
};
