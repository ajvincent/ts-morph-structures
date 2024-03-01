import type {
  ClassStatementsGetter,
  ImportManager,
  MemberedStatementsKey,
  stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import DecoratorModule from "../../moduleClasses/DecoratorModule.js";

export default
abstract class StatementGetterBase
implements ClassStatementsGetter
{
  protected readonly importManager: ImportManager;
  protected readonly baseName: string;
  protected readonly module: DecoratorModule;

  constructor(
    module: DecoratorModule
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
