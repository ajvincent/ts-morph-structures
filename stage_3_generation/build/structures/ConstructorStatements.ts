import assert from "node:assert/strict";

import {
  ClassFieldStatementsMap,
  LiteralTypeStructureImpl,
  MemberedStatementsKey,
  ParameterDeclarationImpl,
  TypeStructureKind,
  type stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../fieldStatements/GetterFilter.js";

import {
  StructureModule
} from "../../moduleClasses/exports.js";
import { StructureKind } from "ts-morph";

export default
class ConstructorStatements extends GetterFilter
{
  protected readonly module: StructureModule;
  readonly #constructorParameters: ParameterDeclarationImpl[];

  constructor(
    module: StructureModule,
    constructorParameters: ParameterDeclarationImpl[]
  )
  {
    super(module);
    this.module = module;
    this.#constructorParameters = constructorParameters;
  }

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== "constructor")
      return false;
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL)
      return true;

    if (key.isFieldStatic === true)
      return false;
    if (key.fieldKey.startsWith("#") || key.fieldKey === "kind" || key.fieldKey.endsWith("Set"))
      return false;
    if (key.fieldType) {
      if (key.fieldType.kind !== StructureKind.PropertySignature)
        return false;
      if (key.fieldType.typeStructure?.kind === TypeStructureKind.Array)
        return false;
      if (key.fieldType.typeStructure === LiteralTypeStructureImpl.get("boolean"))
        return false;
      return key.fieldType.hasQuestionToken === false;
    }

    if (key.fieldKey !== ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN) {
      return true;
    }
    return false;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL)
      return [`super();`];

    let { fieldType } = key;
    if (!fieldType) {
      fieldType = this.module.getFlatTypeMembers().getAsKind(
        StructureKind.PropertySignature,
        key.fieldKey
      );
    }

    assert.equal(fieldType?.kind, StructureKind.PropertySignature);
    const param = new ParameterDeclarationImpl(fieldType.name);
    param.typeStructure = fieldType.typeStructure;
    this.#constructorParameters.push(param);

    return [`this.${fieldType.name} = ${fieldType.name};`];
  }
}
