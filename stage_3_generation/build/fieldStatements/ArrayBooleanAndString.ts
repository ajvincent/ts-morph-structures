import assert from "node:assert/strict";

import {
  ClassFieldStatementsMap,
  LiteralTypeStructureImpl,
  type MemberedStatementsKey,
  type stringWriterOrStatementImpl,
  TypeStructureKind,
} from "#stage_two/snapshot/source/exports.js";
import { StructureKind } from "ts-morph";

import GetterFilter from "./GetterFilter.js";
import {
  BaseClassModule,
} from "../../moduleClasses/exports.js";

const booleanType = LiteralTypeStructureImpl.get("boolean");
const stringType = LiteralTypeStructureImpl.get("string");

export default
class ArrayBooleanAndString extends GetterFilter
{
  readonly #isStructureModule: boolean;
  constructor(
    module: BaseClassModule,
    isStructureModule: boolean
  )
  {
    super(module);
    this.#isStructureModule = isStructureModule;
  }

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return false;
    if (key.fieldType?.kind !== StructureKind.PropertySignature)
      return false;
    if (key.fieldType.hasQuestionToken)
      return false;

    const { typeStructure } = key.fieldType;
    return (
      typeStructure === booleanType ||
      typeStructure === stringType ||
      typeStructure?.kind === TypeStructureKind.Array
    );
  }

  getStatements(
    key: MemberedStatementsKey
  ): stringWriterOrStatementImpl[]
  {
    assert(key.fieldType?.kind === StructureKind.PropertySignature);
    if (key.fieldType.typeStructure === booleanType)
      return ["false"];

    if (key.fieldType.typeStructure === stringType) {
      return this.#isStructureModule ? [] : [`""`];
    }

    return ["[]"];
  }
}
