import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
  SourceFile,
} from "ts-morph";

import {
  ModuleSourceDirectory,
  pathToModule,
} from "./AsyncSpecModules.js";

const TSC_CONFIG = {
  "compilerOptions": {
    "lib": ["es2022"],
    "module": ModuleKind.ESNext,
    "target": ScriptTarget.ESNext,
    "moduleResolution": ModuleResolutionKind.NodeNext,
    "sourceMap": true,
    "declaration": true,
  },
  skipAddingFilesFromTsConfig: true,
};

const project = new Project(TSC_CONFIG);

export default function getTS_SourceFile(
  startDir: ModuleSourceDirectory,
  sourceLocation: string,
) : SourceFile
{
  const pathToSourceFile = pathToModule(startDir, sourceLocation);
  project.addSourceFileAtPath(pathToSourceFile);
  project.resolveSourceFileDependencies();

  return project.getSourceFileOrThrow(pathToSourceFile);
}
