import {
  StructureKind
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  type MemberedStatementsKey,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../GetterFilter.js";

export default
class ShadowArrayStatements extends GetterFilter
{
  static readonly #regexp = /^#(.*)_ShadowArray$/;

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return false;
    if (key.fieldType?.kind !== StructureKind.PropertySignature)
      return false;
    if (key.isFieldStatic === true)
      return false;
    if (!ShadowArrayStatements.#regexp.test(key.fieldType.name)) {
      return false;
    }
    return true;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    void(key);
    return ["[]"];
  }
}

