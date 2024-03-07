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

import PropertyHashesWithTypes from "../../classTools/PropertyHashesWithTypes.js";

export default
class TypeStructureSetStatements extends GetterFilter
{
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
    if (!key.fieldType.name.endsWith("Set")) {
      return false;
    }
    const propName = key.fieldType.name.replace(/Set$/, "");
    return PropertyHashesWithTypes.has(this.module.baseName + ":" + propName);
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    assert(key.fieldType?.kind === StructureKind.PropertySignature);
    const propBase: string = key.fieldType.name.replace(/Set$/, "");

    this.module.addImports("internal", ["TypeStructureSetInternal"], []);
    return [
      new CallExpressionStatementImpl({
        name: "new TypeStructureSetInternal",
        parameters: [
          `this.#${propBase}_ShadowArray`
        ]
      }).writerFunction
    ];
  }
}
