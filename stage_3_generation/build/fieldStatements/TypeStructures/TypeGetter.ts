import {
  StructureKind
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  type MemberedStatementsKey,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../GetterFilter.js";
import PropertyHashesWithTypes from "../../classTools/PropertyHashesWithTypes.js";

export default
class TypeGetterStatements extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return false;
    if (key.fieldType?.kind !== StructureKind.GetAccessor)
      return false;
    return PropertyHashesWithTypes.has(this.module.baseName, key.fieldKey);
  }
  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    return [`this.#${key.fieldKey}Manager.type`];
  }
}
