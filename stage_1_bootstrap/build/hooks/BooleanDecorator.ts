// #region preamble
import {
  StatementStructures,
  WriterFunction,
} from "ts-morph";

import {
  ClassDeclarationImpl,
  PropertyDeclarationImpl,
  SourceFileImpl,
} from "../../prototype-snapshot/exports.js";

import type {
  DecoratorImplMeta
} from "../structureMeta/DataClasses.js";

import StructureDictionaries, {
  type DecoratorHook,
} from "../StructureDictionaries.js";

import ConstantTypeStructures from "../utilities/ConstantTypeStructures.js";
import defineCopyFieldsMethod from "../utilities/defineCopyFieldsMethod.js";
import defineDecoratorImports from "../utilities/defineDecoratorImports.js";
import defineDecoratorWrapper from "../utilities/defineDecoratorWrapper.js";
import defineFieldsType from "../utilities/defineFieldsType.js";
import defineSatisfiesWriter from "../utilities/defineSatisfiesWriter.js";
import saveDecoratorFile from "../utilities/saveDecoratorFile.js";

// #endregion preamble

export default async function BooleanDecoratorHook(
  name: string,
  meta: DecoratorImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  if (!meta.isBooleanKeysOnly()) {
    return Promise.resolve();
  }

  const classDecl = new ClassDeclarationImpl;
  dictionaries.metaToClassMap.set(meta, classDecl);
  classDecl.name = meta.structureName.replace(/Structure$/, "Mixin");
  classDecl.extends = "baseClass";

  const importMgr = defineDecoratorImports(meta, classDecl.name);
  dictionaries.classToImportsMap.set(classDecl, importMgr);

  const copyFields = defineCopyFieldsMethod(meta, classDecl);

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
  const fnDecl = defineDecoratorWrapper(meta, classDecl, alias);

  // wrap in exported subclass decorator
  const statements: (WriterFunction | StatementStructures)[] = [
    declareConstSymbol(meta.structureName),
    alias,
    fnDecl,
    defineSatisfiesWriter(fnDecl, alias),
  ];

  // create source file
  const source = new SourceFileImpl;
  source.statements = [
    "//#region preamble",
    ...importMgr.getDeclarations(),
    "//#endregion preamble",
    ...statements,
  ];
  dictionaries.classToSourceMap.set(classDecl, source);

  await saveDecoratorFile(meta, dictionaries, alias);
}
BooleanDecoratorHook satisfies DecoratorHook;

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


