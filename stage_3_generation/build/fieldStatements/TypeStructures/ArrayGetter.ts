import assert from "node:assert/strict";

import {
  StructureKind
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  TypeStructureKind,
  type MemberedStatementsKey,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../GetterFilter.js";

import PropertyHashesWithTypes from "../../classTools/PropertyHashesWithTypes.js";

export default
class TypeArrayStatements extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return false;
    if (key.fieldType?.kind !== StructureKind.GetAccessor)
      return false;
    if (key.fieldType.returnTypeStructure?.kind !== TypeStructureKind.Array)
      return false;
    const hash = this.module.baseName + ":" + key.fieldType.name;
    return PropertyHashesWithTypes.has(hash);
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    assert.equal(key.fieldType?.kind, StructureKind.GetAccessor);
    return [`this.#${key.fieldType.name}ProxyArray`];
  }
}
