import path from "path";

import {
  ClassDeclarationImpl,
  LiteralTypedStructureImpl,
  TypeArgumentedTypedStructureImpl,
  SourceFileImpl,
  UnionTypedStructureImpl,
  TypeStructures,
  StringTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import StructureDictionaries, {
  type StructureParts
} from "#stage_one/build/StructureDictionaries.js";

import type {
  DecoratorImplMeta,
  StructureImplMeta,
} from "#stage_one/build/structureMeta/DataClasses.js";

import StructureMixinWriter from "#stage_one/build/utilities/StructureMixinWriter.js";

import {
  distDir
} from "#stage_one/build/constants.js";
import defineCopyFieldsMethod from "#stage_one/build/utilities/defineCopyFieldsMethod.js";

import ClassFieldStatementsMap from "#stage_one/build/utilities/public/ClassFieldStatementsMap.js";
import ClassMembersMap from "#stage_one/build/utilities/public/ClassMembersMap.js";
import ImportManager from "#stage_one/build/utilities/public/ImportManager.js";
import ConstantTypeStructures from "#stage_one/build/utilities/ConstantTypeStructures.js";


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

  parts.classDecl.implementsSet.add(defineRequiredOmit(meta, dictionaries));

  parts.classFieldsStatements = new ClassFieldStatementsMap;
  parts.classMembersMap = new ClassMembersMap;

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
      name,
    ]
  });

  parts.importsManager.addImports({
    pathToImportedModule: "type-fest",
    isPackageImport: true,
    isDefaultImport: false,
    isTypeOnly: true,
    importNames: [
      "Class",
    ]
  });

  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isPackageImport: false,
    isDefaultImport: false,
    isTypeOnly: true,
    importNames: [
      "ExtractStructure",
      "PreferArrayFields",
      "RequiredOmit",
    ]
  });

  parts.mixinBaseWriter = StructureMixinWriter(
    meta, parts.importsManager, dictionaries, dictionaries.getDecoratorCountMap()
  );

  parts.copyFields = defineCopyFieldsMethod(
    meta,
    parts as Pick<
      StructureParts,
      "classDecl" | "classFieldsStatements" | "classMembersMap" | "importsManager"
    >,
    dictionaries
  );

  dictionaries.structureParts.set(meta, parts as StructureParts);
  return Promise.resolve();
}

function defineRequiredOmit(
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): TypeArgumentedTypedStructureImpl
{
  const literalType = new LiteralTypedStructureImpl(meta.structureName);
  const typeArgumented = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.PreferArrayFields, [literalType]
  );

  const requiredOmitChildren: TypeStructures[] = [typeArgumented];

  const unionChildTypes: TypeStructures[] = [];
  meta.decoratorKeys.forEach((decoratorName): void => {
    const decoratorData: DecoratorImplMeta = dictionaries.decorators.get(decoratorName)!;
    decoratorData.structureFields.forEach((propertyValue, key) => {
      if (propertyValue.hasQuestionToken)
        unionChildTypes.push(new StringTypedStructureImpl(key));
    });
  });

  if (unionChildTypes.length > 0) {
    requiredOmitChildren.push(new UnionTypedStructureImpl(unionChildTypes))
  }

  return new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.RequiredOmit,
    requiredOmitChildren
  );
}
