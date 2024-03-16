import assert from "node:assert/strict";

import {
  type CodeBlockWriter,
  StructureKind,
  WriterFunction
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  LiteralTypeStructureImpl,
  MemberedStatementsKey,
  type TypeStructures,
  stringWriterOrStatementImpl,
  TypeStructureKind,
} from "#stage_two/snapshot/source/exports.js";

import GetterFilter from "../fieldStatements/GetterFilter.js";

import BlockStatementImpl from "../../pseudoStatements/BlockStatement.js";
import CallExpressionStatementImpl from "../../pseudoStatements/CallExpression.js";

export default class ToJSONStatements extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    return (
      (key.statementGroupKey === "toJSON") &&
      (key.isFieldStatic === false) &&
      (key.fieldKey.startsWith("#") === false) &&
      (key.fieldKey.endsWith("Set") === false)
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

    assert(key.fieldType?.kind === StructureKind.PropertySignature || key.fieldType?.kind === StructureKind.GetAccessor);
    let hasWriter: boolean;

    const fieldName = key.fieldKey;
    let mayBeUndefined = false;
    let isArray = false;

    let mayBeStructure = false;

    if (key.fieldType?.kind === StructureKind.PropertySignature) {
      assert(key.fieldType.typeStructure, "missing type structure: " + this.baseName + ":" + key.fieldKey);
      const { typeStructure } = key.fieldType;
      hasWriter = ToJSONStatements.#hasWriter(typeStructure);
      mayBeUndefined = key.fieldType.hasQuestionToken;

      if (typeStructure.kind === TypeStructureKind.Array) {
        isArray = true;
        mayBeStructure = ToJSONStatements.#hasStructure(typeStructure.objectType);
      }
    }
    else {
      assert(key.fieldType.returnTypeStructure, "missing type structure: " + this.baseName + ":" + key.fieldKey);
      const { returnTypeStructure } = key.fieldType;
      hasWriter = ToJSONStatements.#hasWriter(returnTypeStructure);
      if (returnTypeStructure.kind === TypeStructureKind.Union) {
        mayBeUndefined = returnTypeStructure.childTypes.includes(LiteralTypeStructureImpl.get("undefined"));
      }
      if (returnTypeStructure.kind === TypeStructureKind.Array) {
        isArray = true;
        mayBeStructure = ToJSONStatements.#hasStructure(returnTypeStructure.objectType);
      }
    }

    let value: WriterFunction = (writer: CodeBlockWriter): void => {
      writer.write(`this.${fieldName}`);
      if (hasWriter && isArray) {
        writer.write(`.map((value) =>`);
        writer.block(() => {
          if (mayBeStructure)
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
      ];
    }

    return [statement];
  }

  static #hasStructure(
    typeStructure: TypeStructures
  ): boolean
  {
    if (typeStructure.kind !== TypeStructureKind.Parentheses)
      return false;
    typeStructure = typeStructure.childTypes[0];

    if (typeStructure.kind !== TypeStructureKind.Union)
      return false;

    const { childTypes } = typeStructure;
    return childTypes.some(child => child !== LiteralTypeStructureImpl.get("stringOrWriterFunction"));
  }

  static #hasWriter(
    typeStructure: TypeStructures
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
