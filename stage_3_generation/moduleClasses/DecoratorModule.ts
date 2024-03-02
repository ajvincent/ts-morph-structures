import {
  VariableDeclarationKind,
} from "ts-morph";

import {
  ClassDeclarationImpl,
  FunctionDeclarationImpl,
  IndexedAccessTypeStructureImpl,
  IntersectionTypeStructureImpl,
  LiteralTypeStructureImpl,
  MemberedObjectTypeStructureImpl,
  MethodSignatureImpl,
  ParameterDeclarationImpl,
  PrefixOperatorsTypeStructureImpl,
  PropertySignatureImpl,
  SourceFileImpl,
  StringTypeStructureImpl,
  TypeAliasDeclarationImpl,
  TypeArgumentedTypeStructureImpl,
  UnionTypeStructureImpl,
  VariableDeclarationImpl,
  VariableStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import {
  getClassInterfaceName,
  getStructureMixinName,
} from "#utilities/source/StructureNameTransforms.js";

import InternalJSDocTag from "../build/classTools/InternalJSDocTag.js";

import SatisfiesStatementImpl from "../pseudoStatements/SatisfiesStatement.js";

import BaseClassModule from "./BaseClassModule.js";

export default
class DecoratorModule extends BaseClassModule
{
  static readonly map = new Map<string, DecoratorModule>;
  static readonly #staticFields = new PropertySignatureImpl("staticFields");
  static {
    this.#staticFields.typeStructure = LiteralTypeStructureImpl.get("object");
  }

  static readonly #typeofStructureBase = new PrefixOperatorsTypeStructureImpl(
    ["typeof"], LiteralTypeStructureImpl.get("StructureBase")
  );

  static readonly #baseClassParam: ParameterDeclarationImpl = new ParameterDeclarationImpl("baseClass");
  static {
    this.#baseClassParam.typeStructure = this.#typeofStructureBase;
  }

  static readonly #contextParam: ParameterDeclarationImpl = new ParameterDeclarationImpl("context");
  static {
    this.#contextParam.typeStructure = LiteralTypeStructureImpl.get("ClassDecoratorContext");
  }

  readonly baseName: string;
  readonly #fieldsType: LiteralTypeStructureImpl;
  readonly decoratorName: string;

  constructor(
    baseName: string,
  )
  {
    const decoratorName = getStructureMixinName(baseName);
    super("source/decorators/standard", decoratorName, false);

    DecoratorModule.map.set(baseName, this);

    this.baseName = baseName;
    this.#fieldsType = LiteralTypeStructureImpl.get(this.baseName + "Fields");
    this.decoratorName = decoratorName;

    this.addImports("ts-morph", [], [baseName, "Structures"]);
    this.addImports("mixin-decorators", [], [
      "MixinClass", "StaticAndInstance", "SubclassDecorator"
    ]);
    this.addImports("public", [], [getClassInterfaceName(baseName)]);
    this.addImports("internal", ["StructureBase"], ["RightExtendsLeft"]);
  }

  get fieldsName(): string {
    return this.baseName + "Fields"
  }

  createCopyFieldsMethod(): MethodSignatureImpl
  {
    const methodSignature = new MethodSignatureImpl("[COPY_FIELDS]");

    const sourceParam = new ParameterDeclarationImpl("source");
    sourceParam.typeStructure = new IntersectionTypeStructureImpl([
      LiteralTypeStructureImpl.get(this.baseName),
      LiteralTypeStructureImpl.get("Structures")
    ]);

    const targetParam = new ParameterDeclarationImpl("target");
    targetParam.typeStructure = new IntersectionTypeStructureImpl([
      LiteralTypeStructureImpl.get(this.decoratorName),
      LiteralTypeStructureImpl.get("Structures")
    ]);

    methodSignature.docs.push(InternalJSDocTag);
    methodSignature.parameters.push(sourceParam, targetParam);
    methodSignature.returnTypeStructure = LiteralTypeStructureImpl.get("void");
  
    this.addImports("internal", ["COPY_FIELDS"], []);
    this.addImports("ts-morph", [], [
      this.baseName,
      "Structures"
    ]);

    return methodSignature;
  }

  createToJSONMethod(): MethodSignatureImpl
  {
    this.addImports("internal", [], ["StructureClassToJSON"]);

    const methodSignature = new MethodSignatureImpl("toJSON");
    methodSignature.returnTypeStructure = new TypeArgumentedTypeStructureImpl(
      LiteralTypeStructureImpl.get("StructureClassToJSON"),
      [
        LiteralTypeStructureImpl.get(this.decoratorName)
      ]
    );
    return methodSignature;
  }

  createStructureIteratorMethod(): MethodSignatureImpl
  {
    this.addImports("public", [], ["StructureImpls", "TypeStructures"]);
    this.addImports("internal", ["STRUCTURE_AND_TYPES_CHILDREN"], []);

    const methodSignature = new MethodSignatureImpl("[STRUCTURE_AND_TYPES_CHILDREN]");
    methodSignature.docs.push(InternalJSDocTag);

    methodSignature.returnTypeStructure = new TypeArgumentedTypeStructureImpl(
      LiteralTypeStructureImpl.get("IterableIterator"),
      [
        new UnionTypeStructureImpl([
          LiteralTypeStructureImpl.get("StructureImpls"),
          LiteralTypeStructureImpl.get("TypeStructures")
        ])
      ]
    );
    return methodSignature;
  }

  protected getSourceFileImpl(): SourceFileImpl
  {
    const sourceFile = new SourceFileImpl;

    sourceFile.statements.push(
      "//#region preamble",
      ...this.importManager.getDeclarations(),
      "//#endregion preamble",

      this.#getKeySymbolStatement(),
      this.#getFieldsAlias(),
      this.#getMixinFunction(),
      this.#getSatisfiesStatement().writerFunction,
    );

    return sourceFile;
  }

  #getKeySymbolStatement(): VariableStatementImpl
  {
    const statement = new VariableStatementImpl;
    statement.hasDeclareKeyword = true;
    statement.declarationKind = VariableDeclarationKind.Const;

    const decl = new VariableDeclarationImpl(this.baseName + "Key");
    decl.typeStructure = new PrefixOperatorsTypeStructureImpl(
      ["unique"], LiteralTypeStructureImpl.get("symbol")
    );
    statement.declarations.push(decl);

    return statement;
  }

  #getFieldsAlias(): TypeAliasDeclarationImpl
  {
    const members = new MemberedObjectTypeStructureImpl;

    const instanceFields = new PropertySignatureImpl(
      "instanceFields"
    );
    instanceFields.typeStructure = LiteralTypeStructureImpl.get(
      getClassInterfaceName(this.baseName)
    );

    const symbolKey = new PropertySignatureImpl("symbolKey");
    symbolKey.typeStructure = new PrefixOperatorsTypeStructureImpl(
      ["typeof"], LiteralTypeStructureImpl.get(this.baseName + "Key")
    );

    members.properties.push(DecoratorModule.#staticFields, instanceFields, symbolKey);

    const staticAndInstance = new TypeArgumentedTypeStructureImpl(
      LiteralTypeStructureImpl.get("StaticAndInstance"), [
        symbolKey.typeStructure
      ]
    );

    const extendsType = new TypeArgumentedTypeStructureImpl(
      LiteralTypeStructureImpl.get("RightExtendsLeft"), [
        staticAndInstance, members
      ]
    );

    const alias = new TypeAliasDeclarationImpl(this.fieldsName, extendsType);
    alias.isExported = true;

    return alias;
  }

  #getMixinFunction(): FunctionDeclarationImpl {
    const fn = new FunctionDeclarationImpl;
    fn.isDefaultExport = true;
    fn.name = this.baseName + "Mixin";
    fn.parameters.push(DecoratorModule.#baseClassParam, DecoratorModule.#contextParam);
    fn.returnTypeStructure = this.#getMixinClassType();

    const classDecl = this.#buildClass();

    fn.statements.push(
      "void context;",
      classDecl,
      "return " + classDecl.name + ";"
    );

    return fn;
  }

  #getMixinClassType(): TypeArgumentedTypeStructureImpl
  {
    return new TypeArgumentedTypeStructureImpl(
      LiteralTypeStructureImpl.get("MixinClass"), [
        new IndexedAccessTypeStructureImpl(
          this.#fieldsType,
          StringTypeStructureImpl.get("staticFields"),
        ),
        new IndexedAccessTypeStructureImpl(
          this.#fieldsType,
          StringTypeStructureImpl.get("instanceFields"),
        ),
        DecoratorModule.#typeofStructureBase
      ]
    );
  }

  #buildClass(): ClassDeclarationImpl
  {
    const classDecl = new ClassDeclarationImpl;
    classDecl.name = this.baseName + "Mixin";
    classDecl.extends = "baseClass";
    this.classMembersMap!.moveMembersToClass(classDecl);
    return classDecl;
  }

  #getSatisfiesStatement(): SatisfiesStatementImpl
  {
    const subclassType = new TypeArgumentedTypeStructureImpl(
      LiteralTypeStructureImpl.get("SubclassDecorator"),
      [
        this.#fieldsType,
        DecoratorModule.#typeofStructureBase,
        LiteralTypeStructureImpl.get("false")
      ]
    );

    return new SatisfiesStatementImpl(
      this.baseName + "Mixin", subclassType
    );
  }
}
