// #region preamble
import {
  type CodeBlockWriter,
  VariableDeclarationKind,
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  LiteralTypeStructureImpl,
  type MemberedStatementsKey,
  ParameterDeclarationImpl,
  PropertySignatureImpl,
  VariableDeclarationImpl,
  VariableStatementImpl,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../../fieldStatements/GetterFilter.js";

import type {
  BaseClassModule,
} from "../../../moduleClasses/exports.js";

import BlockStatementImpl from "../../../pseudoStatements/BlockStatement.js";
import CallExpressionStatementImpl from "../../../pseudoStatements/CallExpression.js";
// #endregion preamble

export function getInsertedAccessorProperty(
  name: string
): PropertySignatureImpl | undefined
{
  if (name === "GetAccessorDeclarationStructure") {
    const prop = new PropertySignatureImpl("returnType");
    prop.hasQuestionToken = true;
    prop.typeStructure = LiteralTypeStructureImpl.get("TypeStructures");
    return prop;
  }

  if (name === "SetAccessorDeclarationStructure") {
    const prop = new PropertySignatureImpl("setterParameter");
    prop.typeStructure = LiteralTypeStructureImpl.get("ParameterDeclarationImpl");
    return prop;
  }

  return undefined;
}

export class AccessorExtraParameters extends GetterFilter
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

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey === "constructor") {
      if ((this.module.defaultExportName === "GetAccessorDeclarationImpl") && (key.fieldKey === "returnType"))
        return true;

      if ((this.module.defaultExportName === "SetAccessorDeclarationImpl") && (key.fieldKey === "setterParameter"))
        return true;
    }

    if ((key.statementGroupKey === "static clone") &&
        (this.module.defaultExportName === "GetAccessorDeclarationImpl") &&
        (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL)) {
      return true;
    }

    return false;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (key.statementGroupKey === "constructor") {
      return this.#getConstructorStatements(key);
    }

    if (key.statementGroupKey === "static clone") {
      return this.#getCloneStatements(key);
    }

    return [];
  }

  #getConstructorStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (key.fieldKey === "returnType") {
      this.module.addImports("public", [], ["TypeStructures"]);

      const parameter = new ParameterDeclarationImpl("returnType");
      parameter.hasQuestionToken = true;
      parameter.typeStructure = LiteralTypeStructureImpl.get("TypeStructures");
      this.#ctorParameters.push(parameter);

      return [
        new BlockStatementImpl(
          `if (returnType)`,
          [`this.returnTypeStructure = returnType;`]
        ).writerFunction,
      ];
    }

    if (key.fieldKey === "setterParameter") {
      this.module.addImports("public", ["ParameterDeclarationImpl"], []);

      const parameter = new ParameterDeclarationImpl("setterParameter");
      parameter.typeStructure = LiteralTypeStructureImpl.get("ParameterDeclarationImpl");
      this.#ctorParameters.push(parameter);

      return [`this.parameters.push(setterParameter);`]
    }

    return [];
  }

  #getCloneStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL) {
      const targetDeclStatement = new VariableStatementImpl;
      targetDeclStatement.declarationKind = VariableDeclarationKind.Const;

      const targetDecl = new VariableDeclarationImpl("target");
      targetDecl.initializer = (writer: CodeBlockWriter): void => {
        const statement = new CallExpressionStatementImpl({
          name: "new " + this.module.exportName,
          parameters: [`source.isStatic ?? false`, `source.name`]
        });
        statement.writerFunction(writer);
      };

      targetDeclStatement.declarations.push(targetDecl);
      return [targetDeclStatement];
    }

    return [];
  }
}
