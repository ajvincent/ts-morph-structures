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
class TypeStructureGetterStatements extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return false;
    if (key.fieldType?.kind !== StructureKind.GetAccessor)
      return false;
    if (key.fieldKey.endsWith("Structure") === false)
      return false;
    return PropertyHashesWithTypes.has(this.module.baseName, key.fieldKey.replace("Structure", ""));
  }
  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    this.module.addImports("public", [], ["TypeStructures"]);
    return [`this.#${key.fieldKey.replace("Structure", "Manager")}.typeStructure`];
  }
}
