import {
  MemberedStatementsKey,
  stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";

import DecoratorModule from "../../moduleClasses/DecoratorModule.js";

import StatementGetterBase from "./GetterBase.js";
import GetterFilter from "./GetterFilter.js";

import ArrayBooleanAndString from "./ArrayBooleanAndString.js";

export default
class StatementsRouter extends StatementGetterBase
{
  readonly filters: GetterFilter[];

  constructor(
    module: DecoratorModule
  )
  {
    super(module);
    this.filters = [
      new ArrayBooleanAndString(module),
    ];
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    for (const filter of this.filters) {
      if (filter.accept(key)) {
        return filter.getStatements(key);
      }
    }

    return [];
  }
}
