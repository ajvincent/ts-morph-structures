// #region preamble
import path from "path";

import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  type ProjectOptions,
  Scope,
  ScriptTarget,
  StatementStructures,
  WriterFunction,
} from "ts-morph";

import {
  ClassDeclarationImpl,
  FunctionDeclarationImpl,
  IndexedAccessTypedStructureImpl,
  LiteralTypedStructureImpl,
  MethodDeclarationImpl,
  ObjectLiteralTypedStructureImpl,
  ParameterDeclarationImpl,
  PrefixOperatorsTypedStructureImpl,
  PropertyDeclarationImpl,
  PropertySignatureImpl,
  SourceFileImpl,
  TypeArgumentedTypedStructureImpl,
  TypeAliasDeclarationImpl,
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

// #endregion preamble

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

  const importMgr = defineImports(meta, classDecl.name);
  dictionaries.classToImportsMap.set(classDecl, importMgr);

  const copyFields = addCopyFieldsMethod(meta, classDecl);

  // apply decorator-specific changes
  meta.booleanKeys.forEach(key => {
    const prop = new PropertyDeclarationImpl(key);
    prop.initializer = "false";

    classDecl.properties.push(prop);

    copyFields.statements.push(
      `target.${key} = source.${key} ?? false;`
    );
  });

  const alias = defineFieldsType(meta.structureName);
  const fnDecl = defineFunctionWrapper(meta, classDecl, alias);

  // wrap in exported subclass decorator
  const statements: (WriterFunction | StatementStructures)[] = [
    declareConstSymbol(meta.structureName),
    alias,
    fnDecl,
    defineSatisfiesWriter(fnDecl, alias),
  ];

  // add to internal exports
  const sourceFilePath = path.join(distDir, `source/decorators/${classDecl.name}.ts`);
  dictionaries.internalExports.addExports({
    absolutePathToModule: sourceFilePath,
    isDefaultExport: true,
    isType: false,
    exportNames: [
      classDecl.name
    ]
  });

  // create source file
  const source = new SourceFileImpl;
  source.statements = [
    "//#region preamble",
    ...importMgr.getDeclarations(),
    "//#endregion preamble",
    ...statements,
  ];
  dictionaries.classToSourceMap.set(classDecl, source);

  await saveSourceFile(
    sourceFilePath,
    source
  );

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
    pathToImportedModule: path.join(distDir, "source/types/RightExtendsLeft.ts"),
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
    writer.write("declare const " + name + "Key: ");
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
    `super.copyFields(source, target);`
  );

  classDecl.methods.push(copyFields);
  return copyFields;
}

function defineFunctionWrapper(
  meta: DecoratorImplMeta,
  classDecl: ClassDeclarationImpl,
  alias: TypeAliasDeclarationImpl
): FunctionDeclarationImpl
{
  const fnDecl = new FunctionDeclarationImpl;
  fnDecl.name = meta.structureName.replace(/Structure$/, "");
  fnDecl.isDefaultExport = true;

  const baseClassParam = new ParameterDeclarationImpl("baseClass");
  baseClassParam.typeStructure = ConstantTypeStructures["typeof StructureBase"];

  const contextParam = new ParameterDeclarationImpl("context");
  contextParam.typeStructure = ConstantTypeStructures.ClassDecoratorContext;

  const aliasName = new LiteralTypedStructureImpl(alias.name);

  fnDecl.parameters.push(baseClassParam, contextParam);
  fnDecl.returnTypeStructure = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.MixinClass,
    [
      new IndexedAccessTypedStructureImpl(
        aliasName,
        ConstantTypeStructures.staticFields
      ),
      new IndexedAccessTypedStructureImpl(
        aliasName,
        ConstantTypeStructures.instanceFields
      ),
      baseClassParam.typeStructure
    ]
  );

  fnDecl.statements.push(
    "void(context);",
    classDecl,
    "return " + classDecl.name + ";",
  );

  return fnDecl;
}

function defineSatisfiesWriter(
  fnDecl: FunctionDeclarationImpl,
  alias: TypeAliasDeclarationImpl,
): WriterFunction
{
  const subclass = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.SubclassDecorator,
    [
      new LiteralTypedStructureImpl(alias.name),
      ConstantTypeStructures["typeof StructureBase"],
      ConstantTypeStructures.false,
    ]
  )
  return writer => {
    writer.write(fnDecl.name!);
    writer.write(" satisfies ");
    subclass.writerFunction(writer);
    writer.writeLine(";");
  };
}

async function saveSourceFile(
  pathToSourceFile: string,
  structure: SourceFileImpl
): Promise<void>
{
  const TSC_CONFIG: ProjectOptions = {
    "compilerOptions": {
      "lib": ["es2022"],
      "module": ModuleKind.ESNext,
      "target": ScriptTarget.ESNext,
      "moduleResolution": ModuleResolutionKind.NodeNext,
      "sourceMap": true,
      "declaration": true,
    },
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
  };
  
  const project = new Project(TSC_CONFIG);
  const source = project.createSourceFile(pathToSourceFile, structure);
  await source.save();
}
