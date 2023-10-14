// #region preamble

import {
  Scope,
} from "ts-morph";

import {
  ClassDeclarationImpl,
  LiteralTypedStructureImpl,
  MethodDeclarationImpl,
  ParameterDeclarationImpl,
  //TypeArgumentedTypedStructureImpl,
  IntersectionTypedStructureImpl,
  TypeArgumentedTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import {
  DecoratorImplMeta,
  StructureImplMeta,
} from "#stage_one/build/structureMeta/DataClasses.js";


import ConstantTypeStructures from "./ConstantTypeStructures.js";
import ImportManager from "../ImportManager.js";
import StructureDictionaries from "../StructureDictionaries.js";
import ClassMembersMap from "../ClassMembersMap.js";

// #endregion preamble

export default function defineCopyFieldsMethod(
  meta: DecoratorImplMeta | StructureImplMeta,
  classDecl: ClassDeclarationImpl,
  classMembers: ClassMembersMap,
  importManager: ImportManager,
  dictionaries: StructureDictionaries
): MethodDeclarationImpl
{
  const copyFields = new MethodDeclarationImpl("[COPY_FIELDS]");
  copyFields.scope = Scope.Public;
  copyFields.isStatic = true;

  importManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isDefaultImport: false,
    isPackageImport: false,
    isTypeOnly: false,
    importNames: [
      "COPY_FIELDS"
    ]
  });

  const sourceParam = new ParameterDeclarationImpl("source");
  const targetParam = new ParameterDeclarationImpl("target");

  if (meta instanceof DecoratorImplMeta) {
    sourceParam.typeStructure = new IntersectionTypedStructureImpl([
      new LiteralTypedStructureImpl(meta.structureName),
      ConstantTypeStructures.Structures
    ]);
    targetParam.typeStructure = new IntersectionTypedStructureImpl([
      /*
      new TypeArgumentedTypedStructureImpl(
        ConstantTypeStructures.Required,
        [
      */
          new LiteralTypedStructureImpl(classDecl.name!),
      /*
        ]
      ),
      */
      ConstantTypeStructures.Structures
    ]);
  }
  else {
    sourceParam.typeStructure = new TypeArgumentedTypedStructureImpl(
      ConstantTypeStructures.OptionalKind,
      [new LiteralTypedStructureImpl(meta.structureName)]
    );
    targetParam.typeStructure = new LiteralTypedStructureImpl(classDecl.name!);
  }

  copyFields.parameters.push(sourceParam, targetParam);
  copyFields.returnTypeStructure = ConstantTypeStructures.void;

  copyFields.statements.push(
    `super[COPY_FIELDS](source, target);`
  );

  classMembers.addMembers([copyFields]);
  return copyFields;
}
