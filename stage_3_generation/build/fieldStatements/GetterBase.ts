import type {
  ClassStatementsGetter,
  ImportManager,
  MemberedStatementsKey,
  stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

export default
abstract class StatementGetterBase
implements ClassStatementsGetter
{
  protected readonly importManager: ImportManager;

  constructor(
    importManager: ImportManager
  )
  {
    this.importManager = importManager;
  }

  abstract getStatements(
    key: MemberedStatementsKey
  ): stringWriterOrStatementImpl[];
}
