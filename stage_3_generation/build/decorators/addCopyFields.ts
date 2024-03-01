//#region preamble
import assert from "node:assert/strict";

import {
  StructureKind,
  WriterFunction,
} from "ts-morph";

import type {
  ReadonlyDeep,
} from "type-fest";

import {
  ClassFieldStatementsMap,
  IntersectionTypeStructureImpl,
  LiteralTypeStructureImpl,
  MemberedStatementsKey,
  type MemberedTypeToClass,
  MethodSignatureImpl,
  ParameterDeclarationImpl,
  type PropertySignatureImpl,
  TypeStructureKind,
  type TypeStructures,
  VoidTypeNodeToTypeStructureConsole,
  getTypeAugmentedStructure,
  type stringWriterOrStatementImpl,
  type stringOrWriterFunction,
} from "#stage_two/snapshot/source/exports.js";

/*
import {
  getStructureNameFromModified,
} from "#utilities/source/StructureNameTransforms.js";
*/

import TS_MORPH_D from "#utilities/source/ts-morph-d-file.js";

import InternalJSDocTag from "../classTools/InternalJSDocTag.js";
import PropertyHashesWithTypes from "../classTools/PropertyHashesWithTypes.js";

import GetterFilter from "../fieldStatements/GetterFilter.js";

import {
  DecoratorModule,
} from "../../moduleClasses/exports.js";

import BlockStatement from "../../pseudoStatements/BlockStatement.js";
//#endregion preamble

export function addCopyFieldsMethod(
  module: DecoratorModule,
  typeToClass: MemberedTypeToClass
): void
{
  const methodSignature = new MethodSignatureImpl("[COPY_FIELDS]");

  const sourceParam = new ParameterDeclarationImpl("source");
  sourceParam.typeStructure = new IntersectionTypeStructureImpl([
    LiteralTypeStructureImpl.get(module.baseName),
    LiteralTypeStructureImpl.get("Structures")
  ]);

  const targetParam = new ParameterDeclarationImpl("target");
  targetParam.typeStructure = new IntersectionTypeStructureImpl([
    LiteralTypeStructureImpl.get(module.decoratorName),
    LiteralTypeStructureImpl.get("Structures")
  ]);

  methodSignature.docs.push(InternalJSDocTag);
  methodSignature.parameters.push(sourceParam, targetParam);
  methodSignature.returnTypeStructure = LiteralTypeStructureImpl.get("void");

  typeToClass.addTypeMember(true, methodSignature);

  module.addImports("internal", ["COPY_FIELDS"], []);
  module.addImports("ts-morph", [], [
    module.baseName,
    "Structures"
  ]);
}

const booleanType = LiteralTypeStructureImpl.get("boolean");
const stringType = LiteralTypeStructureImpl.get("string");
const stringOrWriterFunction = LiteralTypeStructureImpl.get("stringOrWriterFunction");

export class CopyFieldsStatements extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.isFieldStatic === false)
      return false;
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN)
      return false;
    if (key.statementGroupKey !== "static [COPY_FIELDS]")
      return false;
    return true;
  }

  getStatements(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL) {
      return [
        `super[COPY_FIELDS](source, target);`
      ];
    }

    assert(key.fieldType?.kind === StructureKind.PropertySignature, "not a property?");
    assert(key.fieldType.typeStructure, "no type structure?");

    switch (key.fieldType.typeStructure.kind) {
      case TypeStructureKind.Literal:
        return this.#getStatementsForLiteralType(key.fieldType, key.fieldType.typeStructure);
      case TypeStructureKind.Array:
        return this.#getStatementsForArrayType(key.fieldType, key.fieldType.typeStructure.objectType);
    }

    throw new Error("unexpected field type structure: " + key.fieldType.name);
  }

  #getStatementsForLiteralType(
    fieldType: ReadonlyDeep<PropertySignatureImpl>,
    typeStructure: ReadonlyDeep<LiteralTypeStructureImpl>
  ): readonly stringOrWriterFunction[]
  {
    let statement: stringOrWriterFunction;

    if (fieldType.name === "scope")
      this.module.addImports("ts-morph", [], ["Scope"]);

    switch (fieldType.name) {
      case "initializer":
      case "name":
      case "scope":
        statement = this.#getAssignmentStatement(fieldType.name);
        if (fieldType.hasQuestionToken)
          statement = this.#getIfSourceStatement(fieldType.name, statement);
        return [statement];
    }

    const hash = this.baseName + ":" + fieldType.name;
    if (PropertyHashesWithTypes.has(hash)) {
      return this.#getCopyTypeStatements(fieldType.name);
    }

    switch (typeStructure) {
      case booleanType:
        statement = this.#getAssignmentStatement(fieldType.name);
        if (fieldType.hasQuestionToken) {
          statement += " ?? false";
        }
        return [statement];

      case stringType:
        statement = `target.${fieldType.name} = source.${fieldType.name}`;
        if (fieldType.hasQuestionToken) {
          statement += ` ?? ""`;
        }
        return [statement];
    }

    return [];
  }

  #getAssignmentStatement(
    name: string
  ): string
  {
    return `target.${name} = source.${name}`;
  }

  #getIfSourceStatement(
    name: string,
    body: string,
  ): WriterFunction
  {
    return new BlockStatement([body], `if (${name})`).writerFunction;
  }

  #getCopyTypeStatements(
    name: string
  ): readonly stringOrWriterFunction[]
  {
    const name_Structure = name + "Structure";
    this.module.addImports("internal", ["TypeStructureClassesMap"], []);
    return [
      `const { ${name_Structure} } = source as unknown as ${this.baseName}Mixin;`,
      new BlockStatement(
        [`target.${name_Structure} = TypeStructureClassesMap.clone(${name_Structure});`],
        `if (${name_Structure})`
      ).writerFunction,
      new BlockStatement(
        [`target.${name} = source.${name}`],
        `else if (source.${name})`
      ).writerFunction,
    ];
  }

  #getStatementsForArrayType(
    fieldType: ReadonlyDeep<PropertySignatureImpl>,
    objectType: ReadonlyDeep<TypeStructures>
  ): readonly stringOrWriterFunction[]
  {
    void(fieldType);
    void(objectType);
    return [];
    /*
    const { name } = fieldType;

    const originalType = this.#getOriginalType(name);

    if (objectType.kind === TypeStructureKind.Parentheses)
      objectType = objectType.childTypes[0];

    const types = objectType.kind === TypeStructureKind.Union ? objectType.childTypes : [objectType];
    assert(types.every(t => t.kind === TypeStructureKind.Literal));

    const childTypes = types as readonly ReadonlyDeep<LiteralTypeStructureImpl>[];

    let useStructureClassesMap = false;
    let includesString = false;
    for (const childType of childTypes) {
      if (childType === stringType) {
        includesString = true;
      }
      else if (childType === LiteralTypeStructureImpl.get("stringOrWriterFunction")) {
        this.module.addImports("public", [], ["stringOrWriterFunction"]);
      }
      else if (getStructureNameFromModified(childType.stringValue) !== childType.stringValue) {
        this.module.addImports(
          "public",
          ["StructureClassesMap"],
          [childType.stringValue]
        );
        useStructureClassesMap = true;
      }
    }
    // DecoratableNodeStructureMixin
    // JSDocableNodeStructureMixin
    // ParameteredNodeStructureMixin
    // StatementedNodeStructureMixin
    // StructureMixin
    // TypeParameteredNodeStructureMixin

    if (useStructureClassesMap) {

    } else {
      return [
        `target.${name} = source.${name}?.slice() ?? [];`
      ]
    }
    */
  }

  #getOriginalType(
    propertyName: string
  ): TypeStructures
  {
    return getTypeAugmentedStructure(
      TS_MORPH_D.getInterfaceOrThrow(this.baseName).getPropertyOrThrow(propertyName),
      VoidTypeNodeToTypeStructureConsole,
      true,
      StructureKind.PropertySignature
    ).rootStructure.typeStructure!
  }
}
