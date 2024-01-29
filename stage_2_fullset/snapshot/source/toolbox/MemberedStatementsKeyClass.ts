import type { MemberedStatementsKey } from "../exports.js";

/** @internal */
export default class MemberedStatementsKeyClass
  implements MemberedStatementsKey
{
  readonly fieldKey: string;
  readonly statementGroupKey: string;
  readonly purpose: string;

  constructor(fieldKey: string, statementGroupKey: string, purpose: string) {
    this.fieldKey = fieldKey;
    this.statementGroupKey = statementGroupKey;
    this.purpose = purpose;
  }
}
