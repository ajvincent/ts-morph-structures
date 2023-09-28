import path from "path";

import {
  Scope, StatementStructures, WriterFunction,
} from "ts-morph";

import {
  ClassDeclarationImpl,
  PropertyDeclarationImpl,
  MethodDeclarationImpl,
  ParameterDeclarationImpl,
  LiteralTypedStructureImpl,
  TypeArgumentedTypedStructureImpl,
  TypeAliasDeclarationImpl,
  PrefixOperatorsTypedStructureImpl,
  ObjectLiteralTypedStructureImpl,
  PropertySignatureImpl,
} from "../../prototype-snapshot/exports.js";

import ImportManager from "../ImportManager.js";

import type {
  DecoratorImplMeta
} from "../structureMeta/DataClasses.js";

import StructureDictionaries, {
  type DecoratorHook,
} from "../StructureDictionaries.js";

import {
  distDir
} from "../constants.js";

import ConstantTypeStructures from "./ConstantTypeStructures.js";

export default async function BooleanDecoratorHook(
  name: string,
  meta: DecoratorImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  if (meta.structureFieldArrays.size + meta.structureFields.size + meta.decoratorKeys.size > 0) {
    return Promise.resolve();
  }

  const classDecl = new ClassDeclarationImpl;
  dictionaries.metaToClassMap.set(meta, classDecl);
  classDecl.name = meta.structureName.replace(/Structure$/, "DecoratorImpl");
  classDecl.extends = "baseClass";

  dictionaries.classToImportsMap.set(classDecl, defineImports(meta, classDecl.name));

  const copyFields = addCopyFieldsMethod(meta, classDecl);

  // apply type structure changes

  // apply decorator-specific changes
  meta.booleanKeys.forEach(key => {
    const prop = new PropertyDeclarationImpl(key);
    prop.initializer = "false";

    classDecl.properties.push(prop);

    copyFields.statements.push(
      `target.${key} = source.${key} ?? false;`
    );
  });

  // wrap in exported subclass decorator
  const leadingStatements: (WriterFunction | StatementStructures)[] = [
    declareConstSymbol(meta.structureName),
    defineFieldsType(meta.structureName),
  ];
  void(leadingStatements);

  // add to internal exports

  // create source file

  return Promise.resolve();
}
BooleanDecoratorHook satisfies DecoratorHook;

function defineImports(
  meta: DecoratorImplMeta,
  className: string,
): ImportManager
{
  const importManager = new ImportManager(
    path.join(distDir, "source", "decorators", className + ".ts")
  );

  importManager.addImports({
    pathToImportedModule: "mixin-decorators",
    isPackageImport: true,
    isDefaultImport: false,
    isTypeOnly: true,
    importNames: [
      "MixinClass",
      "SubclassDecorator",
      "StaticAndInstance"
    ]
  });

  importManager.addImports({
    pathToImportedModule: "ts-morph",
    isPackageImport: true,
    isDefaultImport: false,
    isTypeOnly: true,
    importNames: [
      meta.structureName
    ]
  });

  importManager.addImports({
    pathToImportedModule: path.join(distDir, "source/_types/RightExtendsLeft.ts"),
    isPackageImport: false,
    isDefaultImport: false,
    isTypeOnly: true,
    importNames: [
      "RightExtendsLeft"
    ]
  });

  importManager.addImports({
    pathToImportedModule: path.join(distDir, "source/base/StructureBase.ts"),
    isPackageImport: false,
    isDefaultImport: true,
    isTypeOnly: false,
    importNames: [
      "StructureBase"
    ]
  });

  return importManager;
}

function declareConstSymbol(
  name: string
): WriterFunction
{
  return writer => {
    writer.write("declare const " + name + "StructureKey: ");
    ConstantTypeStructures.uniqueSymbol.writerFunction(writer);
    writer.writeLine(";");
  };
}

function defineFieldsType(
  name: string
): TypeAliasDeclarationImpl
{
  const alias = new TypeAliasDeclarationImpl(name + "Fields");
  alias.isExported = true;

  const staticFields = new PropertySignatureImpl("staticFields");
  staticFields.typeStructure = ConstantTypeStructures.object;

  const instanceFields = new PropertySignatureImpl("instanceFields");
  instanceFields.typeStructure = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.Required,
    [
      new LiteralTypedStructureImpl(name)
    ]
  );

  const symbolKey = new PropertySignatureImpl("symbolKey");
  symbolKey.typeStructure = new PrefixOperatorsTypedStructureImpl(
    ["typeof"], new LiteralTypedStructureImpl(name + "Key")
  );

  alias.typeStructure = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.RightExtendsLeft,
    [
      new TypeArgumentedTypedStructureImpl(
        ConstantTypeStructures.StaticAndInstance,
        [symbolKey.typeStructure]
      ),

      new ObjectLiteralTypedStructureImpl([
        staticFields,
        instanceFields,
        symbolKey,
      ])
    ]
  );

  return alias;
}

function addCopyFieldsMethod(
  meta: DecoratorImplMeta,
  classDecl: ClassDeclarationImpl
): MethodDeclarationImpl
{
  const copyFields = new MethodDeclarationImpl("copyFields");
  copyFields.scope = Scope.Protected;
  copyFields.isStatic = true;

  const sourceParam = new ParameterDeclarationImpl("source");
  sourceParam.typeStructure = new LiteralTypedStructureImpl(meta.structureName);

  const targetParam = new ParameterDeclarationImpl("target");
  targetParam.typeStructure = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.Required,
    [
      new LiteralTypedStructureImpl(classDecl.name!),
    ]
  );

  copyFields.parameters.push(sourceParam, targetParam);
  copyFields.returnTypeStructure = ConstantTypeStructures.void;

  copyFields.statements.push(
    `super(source, target);`
  );

  classDecl.methods.push(copyFields);
  return copyFields;
}
