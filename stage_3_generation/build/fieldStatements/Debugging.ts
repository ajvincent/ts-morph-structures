import {
  MemberedStatementsKey,
  stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";

import DecoratorModule from "../../moduleClasses/DecoratorModule.js";
import GetterFilter from "./GetterFilter.js";

export default
class DebuggingFilter extends GetterFilter
{
  #baseNamePrefix?: string;
  #fieldKey: string;
  #statementGroupKey: string;

  constructor(
    module: DecoratorModule,
    fieldKey: string,
    statementGroupKey: string,
    baseName?: string
  )
  {
    super(module);
    this.#fieldKey = fieldKey;
    this.#statementGroupKey = statementGroupKey;
    this.#baseNamePrefix = baseName;
  }

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if ((key.fieldKey === this.#fieldKey) && (key.statementGroupKey === this.#statementGroupKey)) {
      if (!this.#baseNamePrefix || this.module.baseName.startsWith(this.#baseNamePrefix)) {
        // eslint-disable-next-line no-debugger
        debugger;
      }
    }
    return false;
  }
  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    void(key);
    throw new Error("Method not implemented.");
  }
}
