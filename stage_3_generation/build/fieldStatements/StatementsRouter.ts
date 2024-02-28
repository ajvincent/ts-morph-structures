import {
  ImportManager,
  MemberedStatementsKey,
  stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";
import StatementGetterBase from "./GetterBase.js";
import GetterFilter from "./GetterFilter.js";

import ArrayBooleanAndString from "./ArrayBooleanAndString.js";

export default
class StatementsRouter extends StatementGetterBase
{
  readonly filters: GetterFilter[];

  constructor(
    importManager: ImportManager
  )
  {
    super(importManager);
    this.filters = [
      new ArrayBooleanAndString(importManager),
    ];
  }

  getStatements(
    key: MemberedStatementsKey
  ): stringWriterOrStatementImpl[]
  {
    for (const filter of this.filters) {
      if (filter.accept(key)) {
        return filter.getStatements(key);
      }
    }

    return [];
  }
}
