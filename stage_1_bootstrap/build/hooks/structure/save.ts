import path from "path";
import {
  WriterFunction,
  type CodeBlockWriter
} from "ts-morph";

import StructureDictionaries from "#stage_one/build/StructureDictionaries.js";
import { distDir } from "#stage_one/build/constants.js";
import saveSourceFile from "#stage_one/build/utilities/saveSourceFile.js";

import type {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

import {
  ClassDeclarationImpl,
  IndexedAccessTypedStructureImpl,
  IntersectionTypedStructureImpl,
  LiteralTypedStructureImpl,
  TypeArgumentedTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import ConstantTypeStructures from "#stage_one/build/utilities/ConstantTypeStructures.js";

export default async function saveDecoratorFile(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta);
  if (!parts)
    return Promise.resolve();

  parts.sourceFile.statements = [
    "//#region preamble",
    ...parts.importsManager.getDeclarations(),
    "//#endregion preamble",
    parts.mixinBaseWriter,
    parts.classDecl,
    satisfiesCloneableWriter(meta.structureName, parts.classDecl),
    addToCloneableMapWriter(meta.structureKindName, parts.classDecl)
  ];

  const sourceFilePath = path.join(distDir, `source/structures/${parts.classDecl.name!}.ts`);
  dictionaries.publicExports.addExports({
    absolutePathToModule: sourceFilePath,
    isDefaultExport: true,
    isType: false,
    exportNames: [
      parts.classDecl.name!
    ]
  });

  await saveSourceFile(
    sourceFilePath,
    parts.sourceFile
  );
}

function satisfiesCloneableWriter(
  structureName: string,
  classDecl: ClassDeclarationImpl
): WriterFunction
{
  const structureAsLiteral = new LiteralTypedStructureImpl(structureName);
  const classNameAsLiteral = new LiteralTypedStructureImpl(classDecl.name!);

  const intersection = new IntersectionTypedStructureImpl([
    new TypeArgumentedTypedStructureImpl(
      ConstantTypeStructures.CloneableStructure, [
        structureAsLiteral,
        classNameAsLiteral
      ]
    ),

    new TypeArgumentedTypedStructureImpl(
      ConstantTypeStructures.Class, [
        new TypeArgumentedTypedStructureImpl(
          ConstantTypeStructures.ExtractStructure,
          [
            new IndexedAccessTypedStructureImpl(
              structureAsLiteral,
              ConstantTypeStructures.kind
            )
          ],
        )
      ]
    )
  ]);

  return function(writer: CodeBlockWriter): void {
    writer.writeLine(`${classDecl.name!} satisfies `);
    intersection.writerFunction(writer);
  }
}

function addToCloneableMapWriter(
  structureKindName: string,
  classDecl: ClassDeclarationImpl
): WriterFunction
{
  return function(writer: CodeBlockWriter): void {
    writer.writeLine(`StructuresClassesMap.set(StructureKind.${structureKindName}, ${classDecl.name!});`);
  }
}
