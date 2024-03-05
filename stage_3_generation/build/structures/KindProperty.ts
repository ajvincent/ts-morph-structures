import assert from "node:assert/strict";

import {
  StructureKind
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  MemberedStatementsKey,
  TypeStructureKind,
  type stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../fieldStatements/GetterFilter.js";
import {
  StructureModule
} from "../../moduleClasses/exports.js";

export default
class KindPropertyInitializer extends GetterFilter
{
  protected module: StructureModule;

  constructor(module: StructureModule) {
    super(module);
    this.module = module;
  }

  accept(key: MemberedStatementsKey): boolean {
    if (key.statementGroupKey !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return false;
    if (key.fieldKey !== "kind")
      return false;
    return true;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    assert(key.fieldType, "No field type?")
    assert.equal(key.fieldType.kind, StructureKind.PropertySignature, "kind must be a property");
    assert.equal(key.fieldType.typeStructure?.kind, TypeStructureKind.QualifiedName, "Not a qualified name?");
    assert.equal(key.fieldType.typeStructure.childTypes.length, 2);
    assert.equal(key.fieldType.typeStructure.childTypes[0], "StructureKind");

    return [
      `StructureKind.${key.fieldType.typeStructure.childTypes[1]}`
    ];
  }
}
