//#region preamble
import assert from "node:assert/strict";

import {
  CodeBlockWriter,
  InterfaceDeclaration,
  PropertySignature,
  StructureKind,
  VariableDeclarationKind,
  WriterFunction,
} from "ts-morph";

import {
  ArrayTypeStructureImpl,
  ClassFieldStatementsMap,
  GetAccessorDeclarationImpl,
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

import GetterFilter from "../fieldStatements/GetterFilter.js";

import BlockStatementImpl from "../../pseudoStatements/BlockStatement.js";
import CallExpressionStatementImpl from "../../pseudoStatements/CallExpression.js";
import {
  InterfaceModule,
} from "../../moduleClasses/exports.js";
//#endregion preamble

const booleanType = LiteralTypeStructureImpl.get("boolean");
const stringType = LiteralTypeStructureImpl.get("string");

export default class CopyFieldsStatements extends GetterFilter
{
  static #managerRE = /^#.*Manager$/;

  accept(
    key: MemberedStatementsKey
  ): boolean
  {
    if (key.statementGroupKey !== "static [COPY_FIELDS]")
      return false;
    if (key.isFieldStatic === true)
      return false;
    if (key.fieldKey === ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN)
      return false;
    if (key.fieldKey === "kind")
      return false;
    if (key.fieldKey.endsWith("Set"))
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

    if (key.fieldType?.kind === StructureKind.GetAccessor) {
      return this.#getCopyTypeStatements(key.fieldType);
    }

    assert.equal(
      key.fieldType?.kind,
      StructureKind.PropertySignature,
      "not a property?  " + (key.fieldType ? StructureKind[key.fieldType.kind] : "(undefined)"));

    if (key.fieldType.name.startsWith("#"))
      return [];

    assert(key.fieldType.typeStructure, "no type structure?");

    switch (key.fieldType.typeStructure.kind) {
      case TypeStructureKind.Literal:
        return this.#getStatementsForLiteralType(key.fieldType, key.fieldType.typeStructure);
      case TypeStructureKind.Array:
        return this.#getStatementsForArrayType(key.fieldType, key.fieldType.typeStructure.objectType);
      case TypeStructureKind.Union:
        return this.#getStatementsForUnionType(key.fieldType, key.fieldType.typeStructure.childTypes);
    }

    throw new Error(`unexpected field type structure: ${this.baseName}:${key.fieldType.name}, ${TypeStructureKind[key.fieldType.typeStructure.kind]}`);
  }

  //#region literal type
  #getStatementsForLiteralType(
    fieldType: PropertySignatureImpl,
    typeStructure: LiteralTypeStructureImpl
  ): readonly stringOrWriterFunction[]
  {
    let statement: stringOrWriterFunction;

    if (fieldType.name === "scope")
      this.module.addImports("ts-morph", [], ["Scope"]);

    switch (fieldType.name) {
      case "initializer":
      case "name":
      case "scope":
      case "variance":
        statement = this.#getAssignmentStatement(fieldType.name);
        if (fieldType.hasQuestionToken)
          statement = this.#getIfSourceStatement(false, fieldType.name, statement);
        return [statement];
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
    member: GetAccessorDeclarationImpl
  ): readonly stringWriterOrStatementImpl[]
  {
    const { name, returnTypeStructure } = member;
    this.module.addImports("internal", ["TypeStructureClassesMap"], []);

    if (returnTypeStructure?.kind === TypeStructureKind.Array) {
      const setName = name + "Set";

      const setStatement = (writer: CodeBlockWriter): void => {
        writer.write(`const { ${setName} } = source as unknown as ${this.module.exportName};`);
      }

      return [
        setStatement,
        new BlockStatementImpl(
          `if (${setName} instanceof TypeStructureSetInternal)`,
          [`target.${setName}.cloneFromTypeStructureSet(${setName});`]
        ).writerFunction,

        new BlockStatementImpl(
          `else if (Array.isArray(source.${name}))`,
          [`target.${setName}.replaceFromTypeArray(source.${name});`]
        ).writerFunction,

        new BlockStatementImpl(
          `else if (typeof source.${name} === "function")`,
          [`target.${setName}.replaceFromTypeArray([source.${name}]);`]
        ).writerFunction,
      ];
    }

    const name_Structure = name + "Structure";
    return [
      `const { ${name_Structure} } = source as unknown as ${this.module.exportName};`,

      new BlockStatementImpl(
        `if (${name_Structure})`,
        [`target.${name_Structure} = TypeStructureClassesMap.clone(${name_Structure});`],
      ).writerFunction,

      this.#getIfSourceStatement(true, name, `target.${name} = source.${name}`),
    ];
  }
  //#endregion literal type

  #getStatementsForArrayType(
    fieldType: PropertySignatureImpl,
    objectType: TypeStructures
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

    if (this.baseName.startsWith("Jsx")) {
      console.warn(`to fix later: ${this.module.baseName}:${fieldType.name}`);
      return [];
    }

    if (objectType.kind === TypeStructureKind.Parentheses)
      objectType = objectType.childTypes[0];

    const types = objectType.kind === TypeStructureKind.Union ? objectType.childTypes : [objectType];
    assert(types.every(t => t.kind === TypeStructureKind.Literal), `unexpected type for ${this.module.baseName}:${fieldType.name}`);

    const childTypes = types as readonly LiteralTypeStructureImpl[];

    let generatedClassName = "";

    for (const childType of childTypes) {
      if (childType === LiteralTypeStructureImpl.get("stringOrWriterFunction")) {
        this.module.addImports("public", [], ["stringOrWriterFunction"]);
      }
      else if (getStructureNameFromModified(childType.stringValue) !== childType.stringValue) {
        assert(generatedClassName === "", "generatedClassName: " + generatedClassName + ", string value: " + childType.stringValue);

        this.module.addImports("public", [], [childType.stringValue]);
        this.module.addImports("internal", ["StructureClassesMap"], []);

        generatedClassName = childType.stringValue;
      }
    }

    if (generatedClassName === "") {
      let statement = new CallExpressionStatementImpl({
        name: `target.${name}.push`,
        parameters: [
          `...source.${name}`
        ]
      }).writerFunction;

      if (fieldType.hasQuestionToken) {
        statement = new BlockStatementImpl(
          `if (source.${name})`, [statement]
        ).writerFunction;
      }

      return [statement];
    }

    assert(generatedClassName, `we should be ready to clone structures now, ${this.module.exportName}:${name}`);

    const generatedStructureName = getStructureNameFromModified(generatedClassName);
    const generatedInterfaceName = getClassInterfaceName(generatedStructureName);
    const generatedStructureKind = InterfaceModule.structuresMap.get(generatedInterfaceName)!.structureKindName!;

    this.module.addImports(
      "ts-morph", ["StructureKind"], [generatedStructureName]
    );

    const callClone = new CallExpressionStatementImpl({
      name: "...StructureClassesMap.cloneArrayWithKind",
      typeParameters: [
        LiteralTypeStructureImpl.get(generatedStructureName),
        new QualifiedNameTypeStructureImpl([
          "StructureKind",
          generatedStructureKind
        ]),
        objectType
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

  #getStatementsForUnionType(
    fieldType: PropertySignatureImpl,
    childTypes: TypeStructures[]
  ): readonly stringWriterOrStatementImpl[]
  {
    void(fieldType);
    void(childTypes);
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
          LiteralTypeStructureImpl.get("StatementStructureImpls"),
          LiteralTypeStructureImpl.get("stringOrWriterFunction"),
        ])
      )
    );
    statementsArrayDecl.initializer = `[]`;
    letStatement.declarations.push(statementsArrayDecl);

    const isArrayStatement = new BlockStatementImpl(
      `if (Array.isArray(source.statements))`,
      [
        "statementsArray = source.statements as (StatementStructureImpls | stringOrWriterFunction)[];"
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
    const baseInterface: InterfaceDeclaration = TS_MORPH_D.getInterfaceOrThrow(this.baseName);
    let prop: PropertySignature | undefined = baseInterface.getProperty(propertyName);
    if (!prop) {
      for (const extendsExpr of baseInterface.getExtends()){
        const extendsName = extendsExpr.getFullText().trim();
        const extendsInterface: InterfaceDeclaration = TS_MORPH_D.getInterfaceOrThrow(extendsName);
        prop = extendsInterface.getProperty(propertyName);
        if (prop)
          break;
      }
    }

    assert(prop, "No property yet for name " + this.module.baseName + ":" + propertyName);

    return getTypeAugmentedStructure(
      prop,
      VoidTypeNodeToTypeStructureConsole,
      true,
      StructureKind.PropertySignature
    ).rootStructure;
  }
}
