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

import BlockStatementImpl from "../../pseudoStatements/BlockStatement.js";
import PropertyHashesWithTypes from "../classTools/PropertyHashesWithTypes.js";

import GetterFilter from "./GetterFilter.js";


export default class StructureIteratorStatements extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== "[STRUCTURE_AND_TYPES_CHILDREN]")
      return false;
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL)
      return true;

    return PropertyHashesWithTypes.has(this.module.baseName, key.fieldKey);
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL) {
      return [`yield* super[STRUCTURE_AND_TYPES_CHILDREN]();`];
    }

    assert.equal(key.fieldType?.kind, StructureKind.GetAccessor);
    if (key.fieldType.returnTypeStructure?.kind === TypeStructureKind.Array) {
      return [
        new BlockStatementImpl(
          `for (const typeStructure of this.${key.fieldKey}Set)`,
          [
            `if (typeof typeStructure === "object") yield typeStructure;`
          ]
        ).writerFunction,
      ];
    }

    const propertyName = key.fieldKey + "Structure";
    return [
      `if (typeof this.${propertyName} === "object") yield this.${propertyName};`
    ]
  }
}
