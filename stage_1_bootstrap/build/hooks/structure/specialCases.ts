import {
  StructureKind,
} from "ts-morph";

import StructureDictionaries, {
  StructureParts
} from "#stage_one/build/StructureDictionaries.js";

import {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

import ClassFieldStatementsMap from "#stage_one/build/utilities/public/ClassFieldStatementsMap.js";
import ClassMembersMap from "#stage_one/build/utilities/public/ClassMembersMap.js";

export default function structureSpecialCases(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta)!;
  switch (parts.classDecl.name) {
    case "IndexSignatureDeclarationImpl":
      fixKeyTypeField(parts, dictionaries);
      break;
  }
  return Promise.resolve();
}

function fixKeyTypeField(
  parts: StructureParts,
  dictionaries: StructureDictionaries,
): void
{
  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isPackageImport: false,
    importNames: ["REPLACE_WRITER_WITH_STRING"],
    isDefaultImport: false,
    isTypeOnly: false,
  });

  const propertyName = ClassMembersMap.keyFromName(StructureKind.Property, false, "keyType");
  const getterName = ClassMembersMap.keyFromName(StructureKind.GetAccessor, false, "keyType");
  const setterName = ClassMembersMap.keyFromName(StructureKind.SetAccessor, false, "keyType");

  const setter = parts.classMembersMap.getAsKind(
    setterName,
    StructureKind.SetAccessor
  )!;

  const initializer = parts.classFieldsStatements.get(
    propertyName,
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
  )![0] as string;

  parts.classFieldsStatements.delete(
    propertyName,
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY
  );

  parts.classFieldsStatements.set(
    ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN,
    getterName,
    [
      `const type = ${initializer};`,
      `return type ? StructureBase[REPLACE_WRITER_WITH_STRING](type) : undefined;`,
    ]
  );

  parts.classFieldsStatements.set(
    ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN,
    setterName,
    [
      `${initializer} = ${setter.parameters[0].name};`,
    ]
  );
}
