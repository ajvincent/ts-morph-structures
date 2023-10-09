import path from "path";
import fs from "fs/promises";

import StructureDictionaries from "../StructureDictionaries.js";

import {
  SourceFileImpl,
  LiteralTypedStructureImpl,
  TypeAliasDeclarationImpl,
  UnionTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import ImportManager from "../ImportManager.js";

import saveSourceFile from "./saveSourceFile.js";
import type {
  StructureUnionMeta
} from "../structureMeta/DataClasses.js";

export default async function buildImplUnions(
  dictionary: StructureDictionaries,
  distDir: string
): Promise<void>
{
  const sourceFile = new SourceFileImpl;
  const sourcePath = path.join(distDir, "source/types/StructureImplUnions.d.ts");

  const importManager = new ImportManager(sourcePath);
  const typesToImport: string[] = [];

  dictionary.unions.forEach((unionStructure: StructureUnionMeta, nameOfUnion: string) => {
    const typeAlias = new TypeAliasDeclarationImpl(nameOfUnion.replace(/Structures$/, "StructureImpls"));
    typeAlias.isExported = true;
    const unionElements: LiteralTypedStructureImpl[] = [];

    unionStructure.structureNames.forEach(name => {
      name = name.replace(/Structure$/, "Impl");
      typesToImport.push(name);
      unionElements.push(new LiteralTypedStructureImpl(name.replace(/Structure$/, "Impl")));
    });
    unionStructure.unionKeys.forEach(name => unionElements.push(
      new LiteralTypedStructureImpl(name.replace(/Structures$/, "StructureImpls"))
    ));

    unionElements.sort();
    typeAlias.typeStructure = new UnionTypedStructureImpl(unionElements.filter(Boolean));

    sourceFile.statements.push(typeAlias);
  });

  dictionary.publicExports.addExports({
    absolutePathToModule: sourcePath,
    isDefaultExport: false,
    isType: true,
    exportNames: [],
  });

  importManager.addImports({
    pathToImportedModule: dictionary.publicExports.absolutePathToExportFile,
    isDefaultImport: false,
    isPackageImport: false,
    isTypeOnly: true,
    importNames: typesToImport
  });

  sourceFile.statements.unshift(...importManager.getDeclarations());
  await fs.rm(sourcePath, { force: true });

  await saveSourceFile(sourcePath, sourceFile);
}
