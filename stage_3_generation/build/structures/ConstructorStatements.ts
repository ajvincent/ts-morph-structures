import assert from "node:assert/strict";

import {
  ClassFieldStatementsMap,
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

    if ((key.fieldType === undefined) || (key.isFieldStatic === true))
      return false;
    if (key.fieldKey.startsWith("#") || key.fieldKey === "kind" || key.fieldKey.endsWith("Set"))
      return false;
    if (key.fieldType.kind !== StructureKind.PropertySignature)
      return false;
    if (key.fieldType.typeStructure?.kind === TypeStructureKind.Array)
      return false;
    return key.fieldType.hasQuestionToken === false;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL)
      return [`super();`];

    assert(key.fieldType?.kind === StructureKind.PropertySignature);
    const param = new ParameterDeclarationImpl(key.fieldType.name);
    param.typeStructure = key.fieldType.typeStructure;
    this.#constructorParameters.push(param);

    return [`this.${key.fieldType.name} = ${key.fieldType.name};`];
  }
}
