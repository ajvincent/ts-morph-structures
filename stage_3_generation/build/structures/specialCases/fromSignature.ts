import {
  VariableDeclarationKind,
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  LiteralTypeStructureImpl,
  MemberedStatementsKey,
  MethodSignatureImpl,
  ParameterDeclarationImpl,
  /*
  TypeMembersMap,
  */
  VariableDeclarationImpl,
  VariableStatementImpl,
  stringOrWriterFunction,
  stringWriterOrStatementImpl
} from "#stage_two/snapshot/source/exports.js";

import {
  getClassInterfaceName
} from "#utilities/source/StructureNameTransforms.js";

import GetterFilter from "../../fieldStatements/GetterFilter.js";
/*
import FlatInterfaceMap from "../../../vanilla/FlatInterfaceMap.js";
*/
import {
  BaseClassModule,
  InterfaceModule,
  StructureModule,
} from "../../..//moduleClasses/exports.js";

import CallExpressionStatementImpl from "../../../pseudoStatements/CallExpression.js";

const DeclarationToSignature: ReadonlyMap<string, string> = new Map<string, string>([
  ["ConstructorDeclarationImpl", "ConstructSignatureDeclarationImpl"],
  ["MethodDeclarationImpl", "MethodSignatureImpl"],
  ["PropertyDeclarationImpl", "PropertySignatureImpl"]
]);

export function getFromSignatureMethod(
  module: StructureModule
): MethodSignatureImpl | undefined
{
  const signatureName = DeclarationToSignature.get(module.defaultExportName);
  if (!signatureName)
    return undefined;

  module.addImports("public", [], [signatureName, "JSDocImpl"]);
  module.addImports("internal", ["TypeStructureClassesMap"], []);
  if (module.defaultExportName !== "PropertyDeclarationImpl") {
    module.addImports("public", [], ["ParameterDeclarationImpl", "TypeParameterDeclarationImpl"]);
  }

  const fromSignature = new MethodSignatureImpl("fromSignature");
  if (module.defaultExportName !== "ConstructorDeclarationImpl") {
    const param = new ParameterDeclarationImpl("isStatic");
    param.typeStructure = LiteralTypeStructureImpl.get("boolean");
    fromSignature.parameters.push(param);
  }

  {
    const param = new ParameterDeclarationImpl("signature");
    param.typeStructure = LiteralTypeStructureImpl.get(signatureName);
    fromSignature.parameters.push(param);
  }

  fromSignature.returnTypeStructure = LiteralTypeStructureImpl.get(module.defaultExportName);
  return fromSignature;
}

export class FromSignatureStatements extends GetterFilter
{
  readonly #interfaceModule: Readonly<InterfaceModule>;
  readonly #ctorParameters: readonly ParameterDeclarationImpl[];

  constructor(
    module: BaseClassModule,
    ctorParameters: ParameterDeclarationImpl[],
  )
  {
    super(module);
    this.#interfaceModule = InterfaceModule.structuresMap.get(
      getClassInterfaceName(module.baseName)
    )!;
    this.#ctorParameters = ctorParameters;
  }

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    return key.statementGroupKey === "static fromSignature";
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL) {
      const declStatement = new VariableStatementImpl;
      declStatement.declarationKind = VariableDeclarationKind.Const;

      const declaration = new VariableDeclarationImpl("declaration");
      declStatement.declarations.push(declaration);

      const parameters: stringOrWriterFunction[] = this.#ctorParameters.map(param => {
        return `${param.name === "isStatic" ? "" : "signature."}${param.name}`;
      })

      declaration.initializer = new CallExpressionStatementImpl({
        name: "new " + this.module.defaultExportName,
        parameters,
      }).writerFunction;

      return [
        declStatement,
      ];
    }

    if (key.fieldKey === ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN) {
      return [`return declaration;`];
    }

    return [];
  }
}
