import path from "path";

import StructureDictionaries from "../../StructureDictionaries.js";
import { distDir } from "../../constants.js";
import saveSourceFile from "../../utilities/saveSourceFile.js";

import type {
  StructureImplMeta
} from "../../structureMeta/DataClasses.js";

export default async function saveDecoratorFile(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta);
  if (!parts)
    return Promise.resolve();

  parts.sourceFile.statements = [
    "//#region preamble",
    ...parts.importsManager.getDeclarations(),
    "//#endregion preamble",
    parts.mixinBaseWriter,
    parts.classDecl,
    //satisfiesCloneableWriter(parts.classDecl, buildCloneable)
    //addToCloneableMapWriter(parts.classDecl)
  ];

  const sourceFilePath = path.join(distDir, `source/structures/${parts.classDecl.name!}.ts`);
  dictionaries.publicExports.addExports({
    absolutePathToModule: sourceFilePath,
    isDefaultExport: true,
    isType: false,
    exportNames: [
      parts.classDecl.name!
    ]
  });

  await saveSourceFile(
    sourceFilePath,
    parts.sourceFile
  );
}
