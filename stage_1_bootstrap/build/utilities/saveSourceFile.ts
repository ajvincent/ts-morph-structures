// #region preamble
import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  type ProjectOptions,
  ScriptTarget,
} from "ts-morph";

import {
  SourceFileImpl,
} from "#stage_one/prototype-snapshot/exports.js";
// #endregion preamble

export default async function saveSourceFile(
  pathToSourceFile: string,
  structure: SourceFileImpl
): Promise<void>
{
  const TSC_CONFIG: ProjectOptions = {
    "compilerOptions": {
      "lib": ["es2022"],
      "module": ModuleKind.ESNext,
      "target": ScriptTarget.ESNext,
      "moduleResolution": ModuleResolutionKind.NodeNext,
      "sourceMap": true,
      "declaration": true,
    },
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
  };

  const project = new Project(TSC_CONFIG);
  const source = project.createSourceFile(pathToSourceFile, structure);
  await source.save();
}
