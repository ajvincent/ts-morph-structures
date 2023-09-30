import path from "path";
import { TypeAliasDeclarationImpl } from "../../prototype-snapshot/exports.js";
import StructureDictionaries from "../StructureDictionaries.js";
import { distDir } from "../constants.js";
import { DecoratorImplMeta } from "../structureMeta/DataClasses.js";
import saveSourceFile from "./saveSourceFile.js";

export default async function saveDecoratorFile(
  meta: DecoratorImplMeta,
  dictionaries: StructureDictionaries,
  alias: TypeAliasDeclarationImpl,
): Promise<void>
{
  const classDecl = dictionaries.metaToClassMap.get(meta)!;
  const sourceFilePath = path.join(distDir, `source/decorators/${classDecl.name!}.ts`);
  dictionaries.internalExports.addExports({
    absolutePathToModule: sourceFilePath,
    isDefaultExport: true,
    isType: false,
    exportNames: [
      classDecl.name!
    ]
  });
  dictionaries.internalExports.addExports({
    absolutePathToModule: sourceFilePath,
    isDefaultExport: false,
    isType: true,
    exportNames: [
      alias.name
    ]
  });

  // create source file
  const source = dictionaries.classToSourceMap.get(classDecl)!;

  await saveSourceFile(
    sourceFilePath,
    source
  );
}