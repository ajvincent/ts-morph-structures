import assert from "node:assert/strict";

import {
  StructureKind
} from "ts-morph";

import {
  MemberedStatementsKey,
  type PropertyInitializerGetter,
  TypeStructureKind,
  type stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";

import StatementGetterBase from "./GetterBase.js";

export default
class UndefinedProperties extends StatementGetterBase
implements PropertyInitializerGetter
{
  filterPropertyInitializer(
    key: MemberedStatementsKey
  ): boolean
  {
    assert(key.fieldType?.kind === StructureKind.PropertySignature);
    if (key.fieldType.typeStructure?.kind === TypeStructureKind.Array)
      return false;
    return key.fieldType.hasQuestionToken;
  }

  getPropertyInitializer(
    key: MemberedStatementsKey
  ): stringWriterOrStatementImpl {
    void(key);
    return `undefined`;
  }
}
