import {
  StructureKind
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  MemberedStatementsKey,
  TypeStructureKind,
  type stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "./GetterFilter.js";

export default
class UndefinedProperties extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return false;
    if (key.fieldType?.kind !== StructureKind.PropertySignature)
      return false;
    if (key.fieldType.typeStructure?.kind === TypeStructureKind.Array)
      return false;
    return key.fieldType.hasQuestionToken;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[] {
    void(key);
    return [`undefined`];
  }
}
