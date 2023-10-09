import StructureDictionaries from "#stage_one/build/StructureDictionaries.js";

import {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";
import {
  ClassDeclarationImpl,
  createCodeBlockWriter
} from "#stage_one/prototype-snapshot/exports.js";
import { stringOrWriter } from "#stage_one/source/types/stringOrWriter.js";

export default function structureSpecialCases(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta)!;
  switch (parts.classDecl.name) {
    case "ImportDeclarationImpl":
      fixAssertElements(parts.classDecl);
      break;
    case "ExportDeclarationImpl":
      fixAssertElements(parts.classDecl);
      break;
  }
  return Promise.resolve();
}

function fixAssertElements(
  classDecl: ClassDeclarationImpl
): void
{
  const assertElementsProp = classDecl.properties.find(prop => prop.name === "assertElements")!;
  assertElementsProp.initializer = "undefined";
  assertElementsProp.isReadonly = false;
  assertElementsProp.hasQuestionToken = true;

  const copyFieldsMethod = classDecl.methods.find(prop => prop.name === "[COPY_FIELDS]")!;
  const oldStatementIndex = copyFieldsMethod.statements.findIndex(value => {
    if (typeof value === "object") {
      return false;
    }
    if (typeof value === "function") {
      const writer = createCodeBlockWriter();
      value(writer);
      value = writer.toString();
    }
    return value.includes("assertElements");
  });
  if (oldStatementIndex < 0)
    throw new Error("assertElements not found in ImportDeclarationImpl.prototype.[COPY_FIELDS]?");

  let statement = copyFieldsMethod.statements[oldStatementIndex] as stringOrWriter;
  if (typeof statement === "function") {
    const writer = createCodeBlockWriter();
    statement(writer);
    statement = writer.toString();
  }
  statement = statement.replace("{", "{\ntarget.assertElements = [];");
  copyFieldsMethod.statements.splice(oldStatementIndex, 1, statement);
}
