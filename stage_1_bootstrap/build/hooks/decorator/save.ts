import path from "path";

import {
  WriterFunction,
} from "ts-morph";

import StructureDictionaries from "../../StructureDictionaries.js";
import { distDir } from "../../constants.js";
import ConstantTypeStructures from "../../utilities/ConstantTypeStructures.js";
import defineSatisfiesWriter from "../../utilities/defineSatisfiesWriter.js";
import saveSourceFile from "../../utilities/saveSourceFile.js";

import type {
  DecoratorImplMeta
} from "../../structureMeta/DataClasses.js";

export default async function saveDecoratorFile(
  name: string,
  meta: DecoratorImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.decoratorParts.get(meta);
  if (!parts)
    return Promise.resolve();

  parts.sourceFile.statements = [
    "//#region preamble",
    ...parts.importsManager.getDeclarations(),
    "//#endregion preamble",
    declareConstSymbol(meta.structureName),
    parts.fieldsTypeAlias,
    parts.wrapperFunction,
    defineSatisfiesWriter(parts.wrapperFunction, parts.fieldsTypeAlias),
  ];

  const sourceFilePath = path.join(distDir, `source/decorators/${parts.classDecl.name!}.ts`);
  dictionaries.internalExports.addExports({
    absolutePathToModule: sourceFilePath,
    isDefaultExport: true,
    isType: false,
    exportNames: [
      parts.classDecl.name!
    ]
  });
  dictionaries.internalExports.addExports({
    absolutePathToModule: sourceFilePath,
    isDefaultExport: false,
    isType: true,
    exportNames: [
      parts.fieldsTypeAlias.name
    ]
  });

  await saveSourceFile(
    sourceFilePath,
    parts.sourceFile
  );
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