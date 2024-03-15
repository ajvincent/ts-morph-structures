import {
  MemberedStatementsKey,
  stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";

import { BaseClassModule } from "../../moduleClasses/exports.js";
import GetterFilter from "./GetterFilter.js";

export default
class DebuggingFilter extends GetterFilter
{
  #baseNamePrefix?: string;
  #fieldKeyPrefix: string;
  #groupKeyNeedle: string;

  constructor(
    module: BaseClassModule,
    fieldKeyPrefix: string,
    groupKeyNeedle: string,
    baseName?: string
  )
  {
    super(module);
    this.#fieldKeyPrefix = fieldKeyPrefix;
    this.#groupKeyNeedle = groupKeyNeedle;
    this.#baseNamePrefix = baseName;
  }

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.fieldKey.startsWith(this.#fieldKeyPrefix) && key.statementGroupKey.includes(this.#groupKeyNeedle)) {
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
