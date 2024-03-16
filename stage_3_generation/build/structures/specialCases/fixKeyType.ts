// #region preamble
import {
  ClassFieldStatementsMap,
  type MemberedStatementsKey,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../../fieldStatements/GetterFilter.js";

// #endregion preamble

void(ClassFieldStatementsMap);
export default class FixKeyType_Filter extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (this.module.defaultExportName !== "IndexSignatureDeclarationImpl")
      return false;

    if (
      (key.statementGroupKey === ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY) &&
      (key.fieldKey === "keyType")
    )
      return true;

    if (key.statementGroupKey === "get keyType") {
      return (
        (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL) ||
        (key.fieldKey === ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN)
      );
    }

    if ((key.statementGroupKey === "set keyType") && (key.fieldKey === ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN))
      return true;
    return false;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (
      (key.statementGroupKey === ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY) &&
      (key.fieldKey === "keyType")
    )
      return [];

    if (key.statementGroupKey === "get keyType") {
      if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL)
        return [`const type = this.#keyTypeManager.type;`];

      this.module.addImports("internal", ["REPLACE_WRITER_WITH_STRING"], []);
      return [`return type ? StructureBase[REPLACE_WRITER_WITH_STRING](type) : undefined;`];
    }

    if (key.statementGroupKey === "set keyType") {
      return [`this.#keyTypeManager.type = value;`];
    }

    return [];
  }
}
