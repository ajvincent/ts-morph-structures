import type {
  StatementStructureImpls,
  stringOrWriterFunction,
} from "../snapshot/source/exports.js";

import ClassFieldStatementsMap from "./ClassFieldStatementsMap.js";
import ClassMembersMap from "./ClassMembersMap.js";
import TypeMembersMap from "./TypeMembersMap.js";

export interface MemberedStatementsKey {
  readonly fieldKey: string;
  readonly statementGroupKey: string;
  readonly purpose: string;
}

type stringWriterOrStatement = stringOrWriterFunction | StatementStructureImpls;

export type MemberedTypeToClass_StatementGetter = (
  key: MemberedStatementsKey
) => Promise<stringWriterOrStatement[]>;

export default class MemberedTypeToClass {
  readonly #classMembersMap = new ClassMembersMap;
  readonly #classFieldStatementsByPurpose = new Map<string, ClassFieldStatementsMap>;
  readonly purposeNames: string[];

  readonly #statementGetter: MemberedTypeToClass_StatementGetter;

  constructor(
    purposeNames: string[],
    statementGetter: MemberedTypeToClass_StatementGetter
  )
  {
    this.purposeNames = purposeNames.slice();
    this.#statementGetter = statementGetter;
  }

  importFromTypeMembers(
    isStatic: boolean,
    membersMap: TypeMembersMap
  ): void
  {
    void(isStatic);
    void(membersMap);
    throw new Error("not yet implemented");
  }

  async #callStatementGetter(
    keyClass: MemberedStatementsKeyClass
  ): Promise<void>
  {
    const statementsArray: stringWriterOrStatement[] = await this.#statementGetter(keyClass);
    if (statementsArray.length === 0)
      return;

    let statementsMap: ClassFieldStatementsMap;
    if (this.#classFieldStatementsByPurpose.has(keyClass.purpose)) {
      statementsMap = this.#classFieldStatementsByPurpose.get(keyClass.purpose)!;
    }
    else {
      statementsMap = new ClassFieldStatementsMap;
      this.#classFieldStatementsByPurpose.set(keyClass.purpose, statementsMap);
    }

    statementsMap.set(keyClass.fieldKey, keyClass.statementGroupKey, statementsArray.slice());
  }
}

class MemberedStatementsKeyClass implements MemberedStatementsKey {
  readonly fieldKey: string;
  readonly statementGroupKey: string;
  readonly purpose: string;

  constructor(
    fieldKey: string,
    statementGroupKey: string,
    purpose: string
  )
  {
    this.fieldKey = fieldKey;
    this.statementGroupKey = statementGroupKey;
    this.purpose = purpose;
  }
}
