// #region preamble
import {
  ClassFieldStatementsMap,
  LiteralTypeStructureImpl,
  type MemberedStatementsKey,
  ParameterDeclarationImpl,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../../fieldStatements/GetterFilter.js";

import {
  BaseClassModule,
} from "../../../moduleClasses/exports.js";
// #endregion preamble

export default class IsStatic_Constructor extends GetterFilter
{
  readonly #ctorParameters: ParameterDeclarationImpl[];

  constructor(
    module: BaseClassModule,
    ctorParameters: ParameterDeclarationImpl[],
  )
  {
    super(module);
    this.#ctorParameters = ctorParameters;
  }

  accept(key: MemberedStatementsKey): boolean {
    if (key.isFieldStatic)
      return false;
    if (key.fieldKey !== "isStatic")
      return false;

    switch (key.statementGroupKey) {
      case ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY:
      case "static [COPY_FIELDS]":
      case "constructor":
        return true;
    }

    return false;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[] {
    if (key.statementGroupKey === ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)
      return [];

    if (key.statementGroupKey === "static [COPY_FIELDS]")
      return [];

    const ctorParam = new ParameterDeclarationImpl("isStatic");
    ctorParam.typeStructure = LiteralTypeStructureImpl.get("boolean");
    this.#ctorParameters.unshift(ctorParam);

    return [`this.isStatic = isStatic;`];
  }
}
