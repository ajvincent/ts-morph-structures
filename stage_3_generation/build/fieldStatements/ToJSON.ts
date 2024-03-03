import assert from "node:assert/strict";

import {
  type CodeBlockWriter,
  StructureKind,
  WriterFunction
} from "ts-morph";

import type {
  ReadonlyDeep,
} from "type-fest";

import {
  ClassFieldStatementsMap,
  MemberedStatementsKey,
  type TypeStructures,
  stringWriterOrStatementImpl,
  TypeStructureKind,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../fieldStatements/GetterFilter.js";

import BlockStatementImpl from "../../pseudoStatements/BlockStatement.js";
import CallExpressionStatementImpl from "#stage_three/generation/pseudoStatements/CallExpression.js";

export default class ToJSONStatements extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    return (
      (key.statementGroupKey === "toJSON") &&
      (key.isFieldStatic === false)
    );
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL) {
      return [(writer: CodeBlockWriter): void => {
        writer.write(`const rv = super.toJSON() as `);
        assert(key.groupType?.kind === StructureKind.MethodSignature);
        key.groupType.returnTypeStructure?.writerFunction(writer);
        writer.write(";");
      }];
    }

    if (key.fieldKey === ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN) {
      return [`return rv;`];
    }

    assert(key.fieldType?.kind === StructureKind.PropertySignature);
    let hasWriter: boolean;

    let fieldName = key.fieldKey;
    let mayBeUndefined = key.fieldType.hasQuestionToken;
    let isArray: boolean;
    if (/^#.*Manager$/.test(fieldName)) {
      fieldName = fieldName.substring(1).replace("Manager", "");
      hasWriter = true;
      mayBeUndefined = true;
      isArray = false;
    }
    else {
      assert(key.fieldType.typeStructure, "missing type structure: " + this.baseName + ":" + key.fieldKey);
      hasWriter = ToJSONStatements.#hasWriter(key.fieldType.typeStructure);
      isArray = key.fieldType.typeStructure.kind === TypeStructureKind.Array;
    }

    let value: WriterFunction = (writer: CodeBlockWriter): void => {
      writer.write(`this.${fieldName}`);
      if (hasWriter && isArray) {
        writer.write(`.map((value) =>`);
        writer.block(() => {
          if (fieldName === "statements")
            writer.write(`if (typeof value === "object") { return value; }`);
          writer.write(`return StructureBase[REPLACE_WRITER_WITH_STRING](value);`);
        });
        writer.write(")");
      }
    };

    if (hasWriter && !isArray) {
      value = new CallExpressionStatementImpl({
        name: `StructureBase[REPLACE_WRITER_WITH_STRING]`,
        parameters: [value]
      }).writerFunction;
    }

    if (hasWriter) {
      this.module.addImports(
        "internal", ["StructureBase", "REPLACE_WRITER_WITH_STRING"], []
      );
    }

    const statement: WriterFunction = function(
      writer: CodeBlockWriter
    ): void
    {
      writer.write(`rv.${fieldName} = `);
      value(writer);
      writer.write(";");
    }

    if (mayBeUndefined) {
      return [
        new BlockStatementImpl(
          `if (this.${fieldName})`, [statement]
        ).writerFunction,
        new BlockStatementImpl(
          `else `, [
            `rv.${fieldName} = undefined;`
          ]
        ).writerFunction
      ]
    }

    return [statement];
  }

  static #hasWriter(
    typeStructure: ReadonlyDeep<TypeStructures>
  ): boolean
  {
    switch (typeStructure.kind) {
      case TypeStructureKind.Literal:
        return (typeStructure.stringValue === "stringOrWriterFunction") || (typeStructure.stringValue === "WriterFunction");
      case TypeStructureKind.Array:
        return this.#hasWriter(typeStructure.objectType);
      case TypeStructureKind.Parentheses:
        return this.#hasWriter(typeStructure.childTypes[0]);
      case TypeStructureKind.Union:
        return typeStructure.childTypes.some(childType => this.#hasWriter(childType));
    }

    return false;
  }
}
