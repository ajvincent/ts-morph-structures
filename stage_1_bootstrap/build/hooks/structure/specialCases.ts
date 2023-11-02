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
  stringOrWriter
} from "#stage_one/source/types/stringOrWriter.js";

import ClassFieldStatementsMap from "#stage_one/build/utilities/public/ClassFieldStatementsMap.js";
import ClassMembersMap from "#stage_one/build/utilities/public/ClassMembersMap.js";

import { omitPropertyFromRequired } from "../classProperties.js"

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

  let statement = statements[oldStatementIndex] as stringOrWriter;
  if (typeof statement === "function") {
    const writer = createCodeBlockWriter();
    statement(writer);
    statement = writer.toString();
  }
  statement = statement.replace("{", "{\ntarget.assertElements = [];");
  statements.splice(oldStatementIndex, 1, statement);
}
