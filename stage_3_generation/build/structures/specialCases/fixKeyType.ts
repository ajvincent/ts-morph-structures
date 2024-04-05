// #region preamble
import BaseClassModule from "#stage_three/generation/moduleClasses/BaseClassModule";
import {
  type ClassHeadStatementsGetter,
  ClassSupportsStatementsFlags,
  type ClassTailStatementsGetter,
  type MemberedStatementsKey,
  type PropertyInitializerGetter,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";
import StatementGetterBase from "../../fieldStatements/GetterBase";

// #endregion preamble

export default class FixKeyType_Filter extends StatementGetterBase
implements ClassHeadStatementsGetter, ClassTailStatementsGetter, PropertyInitializerGetter
{
  constructor(
    module: BaseClassModule
  )
  {
    super(
      module,
      "FixKeyType_Filter",
      ClassSupportsStatementsFlags.HeadStatements |
      ClassSupportsStatementsFlags.TailStatements |
      ClassSupportsStatementsFlags.PropertyInitializer
    );
  }

  filterHeadStatements(key: MemberedStatementsKey): boolean {
    return (
      (this.module.defaultExportName === "IndexSignatureDeclarationImpl") &&
      (key.statementGroupKey === "get keyType")
    );
  }

  getHeadStatements(key: MemberedStatementsKey): readonly stringWriterOrStatementImpl[] {
    void(key);
    return [`const type = this.#keyTypeManager.type;`];
  }

  filterTailStatements(key: MemberedStatementsKey): boolean {
    if (this.module.defaultExportName !== "IndexSignatureDeclarationImpl")
      return false;

    return (
      (key.statementGroupKey === "get keyType") ||
      (key.statementGroupKey === "set keyType")
    );
  }

  getTailStatements(key: MemberedStatementsKey): readonly stringWriterOrStatementImpl[] {
    if (key.statementGroupKey === "get keyType") {
      this.module.addImports("internal", ["REPLACE_WRITER_WITH_STRING"], []);
      return [`return type ? StructureBase[REPLACE_WRITER_WITH_STRING](type) : undefined;`];
    }

    return [`this.#keyTypeManager.type = value;`];
  }

  filterPropertyInitializer(key: MemberedStatementsKey): boolean {
    return(
      (this.module.defaultExportName === "IndexSignatureDeclarationImpl") &&
      (key.fieldKey === "keyType")
    );
  }

  getPropertyInitializer(key: MemberedStatementsKey): stringWriterOrStatementImpl | undefined {
    void(key);
    return undefined;
  }
}
