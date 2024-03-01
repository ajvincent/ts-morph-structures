import {
  ClassFieldStatementsMap,
  type MemberedStatementsKey,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../GetterFilter.js";

export default
class TypeManagerStatements extends GetterFilter
{
  static readonly #managerRE = /^#(.*)Manager$/;
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return false;
    return TypeManagerStatements.#managerRE.test(key.fieldKey);
  }
  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    void(key);
    this.module.addImports("internal", ["TypeAccessors"], []);
    return [`new TypeAccessors()`];
  }
}
