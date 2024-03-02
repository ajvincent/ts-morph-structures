//#region preamble
import assert from "node:assert/strict";

import {
  StructureKind,
  VariableDeclarationKind,
  WriterFunction,
} from "ts-morph";

import type {
  ReadonlyDeep,
} from "type-fest";

import {
  ArrayTypeStructureImpl,
  ClassFieldStatementsMap,
  LiteralTypeStructureImpl,
  MemberedStatementsKey,
  ParenthesesTypeStructureImpl,
  QualifiedNameTypeStructureImpl,
  type PropertySignatureImpl,
  TypeStructureKind,
  type TypeStructures,
  UnionTypeStructureImpl,
  VariableDeclarationImpl,
  VariableStatementImpl,
  VoidTypeNodeToTypeStructureConsole,
  getTypeAugmentedStructure,
  type stringWriterOrStatementImpl,
  type stringOrWriterFunction,
} from "#stage_two/snapshot/source/exports.js";

import {
  getClassInterfaceName,
  getStructureNameFromModified,
} from "#utilities/source/StructureNameTransforms.js";

import TS_MORPH_D from "#utilities/source/ts-morph-d-file.js";

import PropertyHashesWithTypes from "../classTools/PropertyHashesWithTypes.js";

import GetterFilter from "../fieldStatements/GetterFilter.js";

import BlockStatementImpl from "../../pseudoStatements/BlockStatement.js";
import CallExpressionStatementImpl from "#stage_three/generation/pseudoStatements/CallExpression.js";
import InterfaceModule from "#stage_three/generation/moduleClasses/InterfaceModule.js";
//#endregion preamble

const booleanType = LiteralTypeStructureImpl.get("boolean");
const stringType = LiteralTypeStructureImpl.get("string");
const stringOrWriterFunction = LiteralTypeStructureImpl.get("stringOrWriterFunction");

export default class CopyFieldsStatements extends GetterFilter
{
  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.isFieldStatic === true)
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

    if (/^#.*Manager$/.test(key.fieldKey)) {
      return this.#getStatementsForTypeAccessor(key);
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

  #getStatementsForTypeAccessor(
    key: MemberedStatementsKey
  ): readonly stringWriterOrStatementImpl[]
  {
    this.module.addImports("internal", ["TypeStructureClassesMap"], []);

    const propName = /^#(.*)Manager$/.exec(key.fieldKey)![1];
    const structureName = propName + "Structure";

    return [
      `const { ${structureName }} = source as unknown as ${this.module.decoratorName};`,

      new BlockStatementImpl(
        `if (${structureName})`,
        [`target.${structureName} = TypeStructureClassesMap.clone(${structureName});`],
      ).writerFunction,

      this.#getIfSourceStatement(true, propName, `target.${propName} = source.${propName};`),
    ];
  }

  //#region literal type
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
          statement = this.#getIfSourceStatement(false, fieldType.name, statement);
        return [statement];
    }

    const hash = this.baseName + ":" + fieldType.name;
    if (PropertyHashesWithTypes.has(hash)) {
      return this.#getCopyTypeStatements(fieldType.name);
    }

    const originalField = this.#getOriginalField(fieldType.name);

    switch (typeStructure) {
      case booleanType:
        statement = this.#getAssignmentStatement(fieldType.name);
        if (originalField.hasQuestionToken) {
          statement += " ?? false";
        }
        return [statement];

      case stringType:
        statement = `target.${fieldType.name} = source.${fieldType.name}`;
        if (originalField.hasQuestionToken) {
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
    isElse: boolean,
    name: string,
    body: string,
  ): WriterFunction
  {
    return new BlockStatementImpl(
      `${isElse ? "else " : ""}if (source.${name})`,
      [body],
    ).writerFunction;
  }

  #getCopyTypeStatements(
    name: string
  ): readonly stringOrWriterFunction[]
  {
    const name_Structure = name + "Structure";
    this.module.addImports("internal", ["TypeStructureClassesMap"], []);
    return [
      `const { ${name_Structure} } = source as unknown as ${this.baseName}Mixin;`,

      new BlockStatementImpl(
        `if (${name_Structure})`,
        [`target.${name_Structure} = TypeStructureClassesMap.clone(${name_Structure});`],
      ).writerFunction,

      this.#getIfSourceStatement(true, name, `target.${name} = source.${name}`),
    ];
  }
  //#endregion literal type

  #getStatementsForArrayType(
    fieldType: ReadonlyDeep<PropertySignatureImpl>,
    objectType: ReadonlyDeep<TypeStructures>
  ): readonly stringWriterOrStatementImpl[]
  {
    const { name } = fieldType;

    if ((this.module.baseName === "StatementedNodeStructure") && (name === "statements")) {
      return this.#getStatementsForCloneStatements();
    }

    if ((this.module.baseName === "Structure") && (
      (name === "leadingTrivia") || (name === "trailingTrivia")
    ))
    {
      return this.#getStatementsForTrivia(name);
    }

    // DecoratableNodeStructureMixin
    // JSDocableNodeStructureMixin
    // ParameteredNodeStructureMixin
    // TypeParameteredNodeStructureMixin

    if (objectType.kind === TypeStructureKind.Parentheses)
      objectType = objectType.childTypes[0];

    const types = objectType.kind === TypeStructureKind.Union ? objectType.childTypes : [objectType];
    assert(types.every(t => t.kind === TypeStructureKind.Literal));

    const childTypes = types as readonly ReadonlyDeep<LiteralTypeStructureImpl>[];

    let generatedClassName = "";

    for (const childType of childTypes) {
      if (childType === LiteralTypeStructureImpl.get("stringOrWriterFunction")) {
        this.module.addImports("public", [], ["stringOrWriterFunction"]);
      }
      else if (getStructureNameFromModified(childType.stringValue) !== childType.stringValue) {
        assert(generatedClassName === "");

        this.module.addImports("public", [], [childType.stringValue]);
        this.module.addImports("internal", ["StructureClassesMap"], []);

        generatedClassName = childType.stringValue;
      }
    }
    assert(generatedClassName, `we should be ready to clone structures now, ${this.module.decoratorName}:${name}`);

    const generatedStructureName = getStructureNameFromModified(generatedClassName);
    const generatedInterfaceName = getClassInterfaceName(generatedStructureName);
    const generatedStructureKind = InterfaceModule.structuresMap.get(generatedInterfaceName)!.structureKindName!;

    this.module.addImports(
      "ts-morph", [], ["StructureKind", generatedStructureName]
    );

    const callClone = new CallExpressionStatementImpl({
      name: "...StructureClassesMap.cloneArrayWithKind",
      typeParameters: [
        LiteralTypeStructureImpl.get(generatedStructureName),
        new QualifiedNameTypeStructureImpl([
          "StructureKind",
          generatedStructureKind
        ]),
        objectType as TypeStructures
      ],
      parameters: [
        `StructureKind.${generatedStructureKind}`,
        new CallExpressionStatementImpl({
          name: `StructureClassesMap.forceArray`,
          parameters: [
            `source.${name}`
          ]
        })
      ]
    });

    return [
      new BlockStatementImpl(
      `if (source.${name})`,
      [
        new CallExpressionStatementImpl({
          name: `target.${name}.push`,
          parameters: [
            callClone
          ]
        }).writerFunction
      ]
      ).writerFunction
    ];

    return [];
  }

  #getStatementsForTrivia(
    name: string
  ): readonly stringWriterOrStatementImpl[]
  {
    return [
      new BlockStatementImpl(
        `if (Array.isArray(source.${name}))`,
        [`target.${name}.push(...source.${name});`],
      ).writerFunction,

      new BlockStatementImpl(
        `else if (source.${name} !== undefined)`,
        [`target.${name}.push(source.${name});`],
      ).writerFunction
    ];
  }

  #getStatementsForCloneStatements(): readonly stringWriterOrStatementImpl[]
  {
    const letStatement = new VariableStatementImpl;
    letStatement.declarationKind = VariableDeclarationKind.Let;

    const statementsArrayDecl = new VariableDeclarationImpl("statementsArray");
    statementsArrayDecl.typeStructure = new ArrayTypeStructureImpl(
      new ParenthesesTypeStructureImpl(
        new UnionTypeStructureImpl([
          LiteralTypeStructureImpl.get("stringOrWriterFunction"),
          LiteralTypeStructureImpl.get("StatementStructureImpls"),
        ])
      )
    );
    statementsArrayDecl.initializer = `[]`;
    letStatement.declarations.push(statementsArrayDecl);

    const isArrayStatement = new BlockStatementImpl(
      `if (Array.isArray(source.statements))`,
      [
        "statementsArray = source.statements as (stringOrWriterFunction | StatementStructureImpls)[];"
      ],
    );

    const isDefined = new BlockStatementImpl(
      `else if (source.statements !== undefined)`,
      [
        `statementsArray = [source.statements];`
      ],
    )

    const pushCall = new CallExpressionStatementImpl({
      name: `target.statements.push`,
      parameters: [
        new CallExpressionStatementImpl({
          name: "...statementsArray.map",
          parameters: [
            '(statement) => StatementedNodeStructureMixin.#cloneStatement(statement)'
          ]
        }).writerFunction
      ]
    })

    this.module.addImports(
      "public",
      [], [
        "StatementStructureImpls",
        "stringOrWriterFunction",
      ]
    );

    return [
      letStatement,
      isArrayStatement.writerFunction,
      isDefined.writerFunction,
      pushCall.writerFunction
    ];
  }

  #getOriginalField(
    propertyName: string,
  ): PropertySignatureImpl
  {
    return getTypeAugmentedStructure(
      TS_MORPH_D.getInterfaceOrThrow(this.baseName).getPropertyOrThrow(propertyName),
      VoidTypeNodeToTypeStructureConsole,
      true,
      StructureKind.PropertySignature
    ).rootStructure;
  }
}
