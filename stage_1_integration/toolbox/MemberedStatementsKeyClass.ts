export interface MemberedStatementsKey {
  readonly fieldKey: string;
  readonly statementGroupKey: string;
  readonly purpose: string;
}

export default
class MemberedStatementsKeyClass implements MemberedStatementsKey
{
  readonly fieldKey: string;
  readonly statementGroupKey: string;
  readonly purpose: string;

  constructor(
    fieldKey: string,
    statementGroupKey: string,
    purpose: string
  ) {
    this.fieldKey = fieldKey;
    this.statementGroupKey = statementGroupKey;
    this.purpose = purpose;
  }
}
