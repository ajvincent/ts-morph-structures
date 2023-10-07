import path from "path";

import ImportManager from "#stage_one/build/ImportManager.js";

import {
  ClassDeclarationImpl,
  LiteralTypedStructureImpl,
  SourceFileImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import StructureDictionaries, {
  type StructureParts
} from "#stage_one/build/StructureDictionaries.js";

import type {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

import StructureMixinWriter from "#stage_one/build/utilities/StructureMixinWriter.js";

import {
  distDir
} from "#stage_one/build/constants.js";
import defineCopyFieldsMethod from "#stage_one/build/utilities/defineCopyFieldsMethod.js";

export default function createStructureParts(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts: Partial<StructureParts> = {};
  parts.classDecl = new ClassDeclarationImpl;
  parts.classDecl.name = meta.structureName.replace(/Structure$/, "Impl");
  parts.classDecl.isDefaultExport = true;
  parts.classDecl.extendsStructure = new LiteralTypedStructureImpl(name + "Base");

  parts.sourceFile = new SourceFileImpl;

  parts.importsManager = new ImportManager(
    path.join(distDir, "source", "structures", parts.classDecl.name + ".ts")
  );
  parts.importsManager.addImports({
    pathToImportedModule: "ts-morph",
    isPackageImport: true,
    isDefaultImport: false,
    isTypeOnly: true,
    importNames: [
      "Structures",
      name,
    ]
  });

  parts.mixinBaseWriter = StructureMixinWriter(
    meta, parts.importsManager, dictionaries, dictionaries.getDecoratorCountMap()
  );

  parts.copyFields = defineCopyFieldsMethod(meta, parts.classDecl);

  dictionaries.structureParts.set(meta, parts as StructureParts);
  return Promise.resolve();
}
