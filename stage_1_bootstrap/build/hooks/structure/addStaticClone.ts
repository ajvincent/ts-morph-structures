import {
  Scope,
  StructureKind
} from "ts-morph";

import StructureDictionaries from "#stage_one/build/StructureDictionaries.js";

import {
  StructureImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

import ConstantTypeStructures from "#stage_one/build/utilities/ConstantTypeStructures.js";

import {
  LiteralTypedStructureImpl,
  MethodDeclarationImpl,
  ParameterDeclarationImpl,
  TypeArgumentedTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

export default function addStaticClone(
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.structureParts.get(meta);
  if (!parts)
    return Promise.resolve();

  const { classDecl, classMembersMap, importsManager } = parts;

  importsManager.addImports({
    pathToImportedModule: "ts-morph",
    isPackageImport: true,
    isDefaultImport: false,
    isTypeOnly: false,
    importNames: ["OptionalKind"]
  });

  importsManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isPackageImport: false,
    isDefaultImport: false,
    isTypeOnly: true,
    importNames: [
      "CloneableStructure",
    ]
  });

  importsManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isPackageImport: false,
    isDefaultImport: false,
    isTypeOnly: false,
    importNames: [
      "StructuresClassesMap",
    ]
  });

  const cloneMethod = new MethodDeclarationImpl("clone");
  cloneMethod.scope = Scope.Public;
  cloneMethod.isStatic = true;

  const sourceParam = new ParameterDeclarationImpl("source");
  sourceParam.typeStructure = new TypeArgumentedTypedStructureImpl(
    ConstantTypeStructures.OptionalKind,
    [
      new LiteralTypedStructureImpl(meta.structureName)
    ]
  );
  cloneMethod.parameters.push(sourceParam);

  cloneMethod.returnTypeStructure = new LiteralTypedStructureImpl(classDecl.name!);
  let constructorArgs: string[] = [];

  const ctor = classMembersMap.getAsKind<StructureKind.Constructor>("constructor", StructureKind.Constructor);
  if (ctor) {
    constructorArgs = ctor.parameters.map(param => {
      let rv = "source." + param.name;
      if (param.name === "isStatic")
        rv += " ?? false";
      return rv;
    });

  }

  cloneMethod.statements.push(
    `const target = new ${classDecl.name!}(${constructorArgs.join(", ")});`,
    `this[COPY_FIELDS](source, target);`,
    `return target;`,
  );

  classMembersMap.addMembers([cloneMethod]);

  return Promise.resolve();
}
