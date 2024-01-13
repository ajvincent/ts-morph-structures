import fs from "fs/promises";
import path from "path";
import StructureDictionaries from "./StructureDictionaries.js";

export default async function defineExistingExports(
  dictionaries: StructureDictionaries,
  distDir: string
): Promise<void> {
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
    absolutePathToModule: path.join(distDir, "source/bootstrap/getTypeAugmentedStructure.ts"),
    exportNames: [
      "getTypeAugmentedStructure",
    ],
    isDefaultExport: true,
    isType: false
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/bootstrap/getTypeAugmentedStructure.ts"),
    exportNames: [
      "TypeNodeToTypeStructureConsole"
    ],
    isDefaultExport: false,
    isType: true
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/toolbox/ClassFieldStatementsMap.ts"),
    exportNames: ["ClassFieldStatementsMap"],
    isDefaultExport: true,
    isType: false,
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/toolbox/ClassFieldStatementsMap.ts"),
    exportNames: ["ClassFieldStatement"],
    isDefaultExport: false,
    isType: true,
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/toolbox/ClassMembersMap.ts"),
    exportNames: ["ClassMembersMap"],
    isDefaultExport: true,
    isType: false,
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/toolbox/ClassMembersMap.ts"),
    exportNames: ["ClassMemberImpl"],
    isDefaultExport: false,
    isType: true,
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
    absolutePathToModule: path.join(distDir, "source/toolbox/TypeMembersMap.ts"),
    exportNames: ["TypeMembersMap"],
    isDefaultExport: true,
    isType: false,
  });

  dictionaries.publicExports.addExports({
    absolutePathToModule: path.join(distDir, "source/toolbox/TypeMembersMap.ts"),
    exportNames: [
      "NamedTypeMemberImpl",
      "TypeMemberImpl",
    ],
    isDefaultExport: false,
    isType: true,
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
    exportNames: [
      "TypeStructures",
      "stringTypeStructuresOrNull"
    ],
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
}
