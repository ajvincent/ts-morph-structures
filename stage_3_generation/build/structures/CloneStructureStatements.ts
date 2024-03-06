import {
  VariableDeclarationKind
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  MemberedStatementsKey,
  type ParameterDeclarationImpl,
  VariableDeclarationImpl,
  VariableStatementImpl,
  type stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../fieldStatements/GetterFilter.js";

import {
  StructureModule
} from "../../moduleClasses/exports.js";

import CallExpressionStatementImpl from "../../pseudoStatements/CallExpression.js";

export default
class CloneStructureStatements extends GetterFilter
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
    if (key.statementGroupKey !== "static clone")
      return false;
    if (key.fieldKey !== ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN)
      return false;
    return true;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    void(key);

    const targetDeclStatement = new VariableStatementImpl;
    targetDeclStatement.declarationKind = VariableDeclarationKind.Const;

    const targetDecl = new VariableDeclarationImpl("target");
    targetDecl.initializer = new CallExpressionStatementImpl({
      name: "new " + this.module.exportName,
      parameters: []
    }).writerFunction;
    targetDeclStatement.declarations.push(targetDecl);

    return [
      targetDeclStatement,
      new CallExpressionStatementImpl({
        name: `this[COPY_FIELDS]`,
        parameters: ["source", "target"]
      }).writerFunction,
      `return target;`
    ];
  }
}
