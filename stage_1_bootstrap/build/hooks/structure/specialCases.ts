import {
  StructureKind,
} from "ts-morph";

import StructureDictionaries, {
  StructureParts
} from "#stage_one/build/StructureDictionaries.js";

import {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

import {
  TypeArgumentedTypedStructureImpl,
  createCodeBlockWriter
} from "#stage_one/prototype-snapshot/exports.js";

import type {
  stringOrWriterFunction
} from "#stage_one/source/types/stringOrWriterFunction.js";

import ClassFieldStatementsMap from "#stage_one/build/utilities/public/ClassFieldStatementsMap.js";
import ClassMembersMap from "#stage_one/build/utilities/public/ClassMembersMap.js";

import {
  omitPropertyFromRequired
} from "../classProperties.js"

export default function structureSpecialCases(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta)!;
  switch (parts.classDecl.name) {
    case "ImportDeclarationImpl":
      fixAssertElements(parts);
      break;
    case "ExportDeclarationImpl":
      fixAssertElements(parts);
      break;
    case "IndexSignatureDeclarationImpl":
      fixKeyTypeField(parts, dictionaries);
      break;
  }
  return Promise.resolve();
}

function fixAssertElements(
  parts: StructureParts
): void
{
  const {
    classDecl,
    classFieldsStatements,
    classMembersMap
  } = parts;

  const assertElementsProp = classMembersMap.getAsKind<StructureKind.Property>(
    "assertElements", StructureKind.Property
  )!;
  parts.classFieldsStatements.set(
    "assertElements", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, ["undefined"]
  );
  assertElementsProp.isReadonly = false;
  assertElementsProp.hasQuestionToken = true;

  const requiredOmit = Array.from(classDecl.implementsSet)[0] as TypeArgumentedTypedStructureImpl;
  omitPropertyFromRequired(requiredOmit, "assertElements");

  const copyFieldsMethod = classMembersMap.getAsKind<StructureKind.Method>(
    "static [COPY_FIELDS]", StructureKind.Method
  )!;
  const statements = classFieldsStatements.get(
    "assertElements", ClassMembersMap.keyFromMember(copyFieldsMethod)
  )!;

  const oldStatementIndex = statements.findIndex(value => {
    if (typeof value === "object") {
      return false;
    }
    if (typeof value === "function") {
      const writer = createCodeBlockWriter();
      value(writer);
      value = writer.toString();
    }
    return value.includes("{");
  });
  if (oldStatementIndex < 0)
    throw new Error(`assertElements not found in ${classDecl.name!}[COPY_FIELDS]?`);

  let statement = statements[oldStatementIndex] as stringOrWriterFunction;
  if (typeof statement === "function") {
    const writer = createCodeBlockWriter();
    statement(writer);
    statement = writer.toString();
  }
  statement = statement.replace("{", "{\ntarget.assertElements = [];");
  statements.splice(oldStatementIndex, 1, statement);
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
