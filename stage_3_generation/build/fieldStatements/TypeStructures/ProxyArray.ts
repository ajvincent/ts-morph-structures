import assert from "node:assert/strict";

import {
  StructureKind
} from "ts-morph";

import {
  ArrayTypeStructureImpl,
  ClassFieldStatementsMap,
  LiteralTypeStructureImpl,
  type MemberedStatementsKey,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../GetterFilter.js";
import CallExpressionStatementImpl from "#stage_three/generation/pseudoStatements/CallExpression.js";

export default
class ProxyArrayStatements extends GetterFilter
{
  static readonly #regexp = /^#(.*)ProxyArray$/;

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return false;
    if (key.fieldType?.kind !== StructureKind.PropertySignature)
      return false;
    if (key.isFieldStatic === true)
      return false;
    if (!ProxyArrayStatements.#regexp.test(key.fieldType.name)) {
      return false;
    }
    return true;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    assert(key.fieldType?.kind === StructureKind.PropertySignature);
    const propBase: string = ProxyArrayStatements.#regexp.exec(key.fieldType.name)![1];

    return [
      new CallExpressionStatementImpl({
        name: "new Proxy",
        typeParameters: [
          new ArrayTypeStructureImpl(
            LiteralTypeStructureImpl.get("stringOrWriterFunction")
          )
        ],
        parameters: [
          `this.#${propBase}_ShadowArray`,
          `${this.module.exportName}.#${propBase}ArrayReadonlyHandler`
        ]
      }).writerFunction
    ];
  }
}

