import assert from "node:assert/strict";

import {
  StructureKind
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  type MemberedStatementsKey,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../GetterFilter.js";
import CallExpressionStatementImpl from "../../../pseudoStatements/CallExpression.js";

export default
class ArrayReadonlyHandler extends GetterFilter
{
  static readonly #regexp = /^#(.*)ArrayReadonlyHandler$/;

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return false;
    if (key.fieldType?.kind !== StructureKind.PropertySignature)
      return false;
    if (key.isFieldStatic === false)
      return false;
    if (!ArrayReadonlyHandler.#regexp.test(key.fieldType.name)) {
      return false;
    }
    return true;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    assert(key.fieldType?.kind === StructureKind.PropertySignature);
    const propBase: string = ArrayReadonlyHandler.#regexp.exec(key.fieldType.name)![1];

    this.module.addImports("internal", ["ReadonlyArrayProxyHandler"], []);
    return [
      new CallExpressionStatementImpl({
        name: "new ReadonlyArrayProxyHandler",
        parameters: [
          `"The ${propBase} array is read-only.  Please use this.${propBase}Set to set strings and type structures."`
        ]
      }).writerFunction
    ];
  }

}

