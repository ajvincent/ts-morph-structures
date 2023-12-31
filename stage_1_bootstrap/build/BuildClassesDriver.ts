import fs from "fs/promises";
import path from "path";

import StructureDictionaries from "./StructureDictionaries.js";
import fillDictionaries from "./structureMeta/fillDictionaries.js";

// #region hooks

import createDecoratorParts from "./hooks/decorator/createParts.js";
import addClassProperties from "./hooks/classProperties.js";
import add_toJSON from "./hooks/add_toJSON.js";
import addTSDoc from "./hooks/addTSDoc.js";
import addTypeStructures from "./hooks/addTypeStructures.js";
import moveMembersToClass from "./hooks/moveMembersToClass.js";
import sortClassMembers from "./hooks/sortClassMembers.js";
import sortRequiredOmit from "./hooks/sortRequiredOmit.js";
import saveDecoratorFile from "./hooks/decorator/save.js";
import createStructureParts from "./hooks/structure/createParts.js";
import defineKindProperty from "./hooks/structure/defineKind.js";
import addConstructor from "./hooks/structure/addConstructor.js";
import addStaticClone from "./hooks/structure/addStaticClone.js";
import saveStructureFile from "./hooks/structure/save.js";
import removeUselessCopyFields from "./hooks/structure/removeUselessCopyFields.js";
import structureSpecialCases from "./hooks/structure/specialCases.js";
import buildImplUnions from "./utilities/buildImplUnions.js";

import logIfNameStart from "./hooks/logIfNameStart.js";
void(logIfNameStart);

// #endregion hooks

export default
async function BuildClassesDriver(distDir: string): Promise<void>
{
  const dictionary = new StructureDictionaries;
  await defineExistingExports(dictionary, distDir);

  fillDictionaries(dictionary);

  dictionary.addDecoratorHook("create decorator parts", createDecoratorParts);
  dictionary.addDecoratorHook("add class properties", addClassProperties);
  dictionary.addDecoratorHook("add .toJSON()", add_toJSON);
  dictionary.addDecoratorHook("add TSDoc", addTSDoc);
  dictionary.addDecoratorHook("add type structures", addTypeStructures);
  dictionary.addDecoratorHook("move members to class", moveMembersToClass);
  dictionary.addDecoratorHook("sort class members", sortClassMembers);
  dictionary.addDecoratorHook("sort required omit", sortRequiredOmit);
  dictionary.addDecoratorHook("save decorator file", saveDecoratorFile);

  dictionary.addStructureHook("create structure parts", createStructureParts);
  dictionary.addStructureHook("add class properties", addClassProperties);
  dictionary.addStructureHook("define structure kind", defineKindProperty);
  dictionary.addStructureHook("add constructor", addConstructor);
  dictionary.addStructureHook("add static clone method", addStaticClone);
  dictionary.addStructureHook("remove useless copy-fields method", removeUselessCopyFields);
  dictionary.addStructureHook("add .toJSON()", add_toJSON);
  dictionary.addStructureHook("add type structures", addTypeStructures);
  dictionary.addStructureHook("add TSDoc", addTSDoc);
  dictionary.addStructureHook("special cases", structureSpecialCases);
  dictionary.addStructureHook("move members to class", moveMembersToClass);
  dictionary.addStructureHook("sort class members", sortClassMembers);
  dictionary.addStructureHook("sort required omit", sortRequiredOmit);
  dictionary.addStructureHook("save structure file", saveStructureFile);

  await dictionary.build();
  await buildImplUnions(dictionary, distDir);

  await Promise.all([
    dictionary.publicExports.commit(),
    dictionary.internalExports.commit()
  ]);
}

async function defineExistingExports(
  dictionaries: StructureDictionaries,
  distDir: string,
): Promise<void>
{
  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/TypeStructureKind.ts"),
    exportNames: ["TypeStructureKind"],
    isDefaultExport: false,
    isType: false
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/TypeStructureKind.ts"),
    exportNames: ["KindedTypeStructure"],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/toolbox/ClassMembersMap.ts"),
    exportNames: ["ClassMembersMap"],
    isDefaultExport: true,
    isType: false,
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/toolbox/ExportManager.ts"),
    exportNames: ["ExportManager"],
    isDefaultExport: true,
    isType: false,
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/toolbox/ImportManager.ts"),
    exportNames: ["ImportManager"],
    isDefaultExport: true,
    isType: false,
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/typeStructures/ConditionalTypeStructureImpl.ts"),
    exportNames: ["ConditionalTypeStructureParts"],
    isDefaultExport: false,
    isType: true,
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/typeStructures/FunctionTypeStructureImpl.ts"),
    exportNames: ["FunctionWriterStyle"],
    isDefaultExport: false,
    isType: false
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/typeStructures/FunctionTypeStructureImpl.ts"),
    exportNames: ["FunctionTypeContext"],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/typeStructures/PrefixOperatorsTypeStructureImpl.ts"),
    exportNames: ["PrefixUnaryOperator"],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/typeStructures/TypeStructures.ts"),
    exportNames: ["TypeStructures"],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/types/TypeAndTypeStructureInterfaces.d.ts"),
    exportNames: [],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/array-utilities/ReadonlyArrayProxyHandler.ts"),
    exportNames: ["ReadonlyArrayProxyHandler"],
    isDefaultExport: true,
    isType: false
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/generated/structureToSyntax.ts"),
    exportNames: ["StructureKindToSyntaxKindMap"],
    isDefaultExport: true,
    isType: false,
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/StructureBase.ts"),
    exportNames: ["StructureBase"],
    isDefaultExport: true,
    isType: false
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/StructuresClassesMap.ts"),
    exportNames: ["StructuresClassesMap"],
    isDefaultExport: true,
    isType: false
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/TypeAccessors.ts"),
    exportNames: ["TypeAccessors"],
    isDefaultExport: true,
    isType: false,
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/TypeStructureSet.ts"),
    exportNames: ["TypeStructureSet"],
    isDefaultExport: true,
    isType: false,
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/symbolKeys.ts"),
    exportNames: [
      "COPY_FIELDS",
      "REPLACE_WRITER_WITH_STRING",
    ],
    isDefaultExport: false,
    isType: false
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/bootstrap/structureToNodeMap.ts"),
    exportNames: [
      "structureToNodeMap",
      "structureImplToNodeMap"
    ],
    isDefaultExport: false,
    isType: false
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/base/TypeStructureClassesMap.ts"),
    exportNames: ["TypeStructureClassesMap"],
    isDefaultExport: true,
    isType: false
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/types/CloneableStructure.d.ts"),
    exportNames: ["CloneableStructure"],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/types/ExtractStructure.d.ts"),
    exportNames: ["ExtractStructure"],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/types/PreferArrayFields.d.ts"),
    exportNames: ["PreferArrayFields"],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/types/RequiredOmit.d.ts"),
    exportNames: ["RequiredOmit"],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/types/RightExtendsLeft.d.ts"),
    exportNames: ["RightExtendsLeft"],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/types/StructureClassToJSON.d.ts"),
    exportNames: ["StructureClassToJSON"],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.internalExports.addExports({
    absolutePathToModule: path.join(distDir, "source/typeStructures/TypeStructuresBase.ts"),
    exportNames: ["TypeStructuresBase"],
    isDefaultExport: true,
    isType: false
  });

  const sourceDir = path.join(distDir, "source/typeStructures");
  const typeStructureFiles = (await fs.readdir(
    sourceDir
  )).filter(f => f.endsWith("TypeStructureImpl.ts"));
  typeStructureFiles.forEach((moduleFileName) => {
    dictionaries.publicExports.addExports({
      absolutePathToModule: path.join(sourceDir, moduleFileName),
      exportNames: [moduleFileName.replace(".ts", "")],
      isDefaultExport: true,
      isType: false
    });
  });

  return Promise.resolve();
}
