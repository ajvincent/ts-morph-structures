//#region preamble
import {
  CodeBlockWriter,
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  LiteralTypeStructureImpl,
  MemberedStatementsKey,
  MethodSignatureImpl,
  ParameterDeclarationImpl,
  UnionTypeStructureImpl,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../fieldStatements/GetterFilter.js";

import BlockStatementImpl from "../../pseudoStatements/BlockStatement.js";
import CallExpressionStatementImpl from "#stage_three/generation/pseudoStatements/CallExpression.js";
//#endregion preamble

export default class CloneStatement_Statements extends GetterFilter
{
  getMethodSignature(): MethodSignatureImpl
  {
    this.module.addImports("ts-morph", [], ["StatementStructures"]);
    this.module.addImports("public", [], ["stringOrWriterFunction", "StatementStructureImpls"]);
    const method = new MethodSignatureImpl("#cloneStatement");

    const param = new ParameterDeclarationImpl("source");
    param.typeStructure = new UnionTypeStructureImpl([
      LiteralTypeStructureImpl.get("stringOrWriterFunction"),
      LiteralTypeStructureImpl.get("StatementStructures")
    ]);
    method.parameters.push(param);

    method.returnTypeStructure = new UnionTypeStructureImpl([
      LiteralTypeStructureImpl.get("stringOrWriterFunction"),
      LiteralTypeStructureImpl.get("StatementStructureImpls")
    ]);

    return method;
  }

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    return (
      (key.statementGroupKey === "static #cloneStatement") &&
      (key.fieldKey === ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN)
    );
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    void(key);
    this.module.addImports("internal", ["StructureClassesMap"], []);

    return [
      new BlockStatementImpl(
        `if (typeof source !== "object")`,
        [
          `return source;`
        ]
      ).writerFunction,

      (writer: CodeBlockWriter): void => {
        writer.write("return ");
        (new CallExpressionStatementImpl({
          name: "StructureClassesMap.clone",
          typeParameters: [
            LiteralTypeStructureImpl.get("StatementStructures"),
            LiteralTypeStructureImpl.get("StatementStructureImpls"),
          ],
          parameters: ["source"]
        })).writerFunction(writer);
      }
    ]
  }
}
