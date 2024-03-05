import type {
  ClassStatementsGetter,
  ImportManager,
  MemberedStatementsKey,
  stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import BaseClassModule from "../../moduleClasses/BaseClassModule.js";

export default
abstract class StatementGetterBase
implements ClassStatementsGetter
{
  protected readonly importManager: ImportManager;
  protected readonly baseName: string;
  protected readonly module: BaseClassModule;

  constructor(
    module: BaseClassModule
  )
  {
    this.importManager = module.importManager;
    this.baseName = module.baseName;
    this.module = module;
  }

  abstract getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[];
}
