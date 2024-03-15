import {
  CodeBlockWriter,
  VariableDeclarationKind,
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  LiteralTypeStructureImpl,
  MemberedStatementsKey,
  type ParameterDeclarationImpl,
  VariableDeclarationImpl,
  VariableStatementImpl,
  type stringOrWriterFunction,
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
    targetDecl.initializer = (writer: CodeBlockWriter): void => {
      const statement = new CallExpressionStatementImpl({
        name: "new " + this.module.exportName,
        parameters: this.#constructorParameters.map(
          param => this.#getInitializerValue(param)
        )
      });
      statement.writerFunction(writer);
    };

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

  #getInitializerValue(
    parameter: ParameterDeclarationImpl
  ): stringOrWriterFunction | CallExpressionStatementImpl
  {
    let value = `source.${parameter.name}`;
    if (parameter.name === "isStatic") {
      value += " ?? false";
    }
    else if (parameter.hasQuestionToken) {
      if (parameter.typeStructure === LiteralTypeStructureImpl.get("boolean"))
        value += " ?? false";
    }
    return value;
  }
}
