import {
  WriterFunction,
} from "ts-morph";

import StructureDictionaries from "#stage_one/build/StructureDictionaries.js";
import ConstantTypeStructures from "#stage_one/build/utilities/ConstantTypeStructures.js";
import defineSatisfiesWriter from "#stage_one/build/utilities/defineSatisfiesWriter.js";
import saveSourceFile from "#stage_one/build/utilities/saveSourceFile.js";

import type {
  DecoratorImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

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
    ...parts.moduleInterfaces,
    parts.wrapperFunction,
    defineSatisfiesWriter(parts.wrapperFunction, parts.fieldsTypeAlias),
  ];

  const sourceFilePath = parts.importsManager.absolutePathToModule;
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
