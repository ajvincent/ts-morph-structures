import {
  StructureKind
} from "ts-morph";

import StructureDictionaries, {
  DecoratorParts,
  StructureParts,
} from "#stage_one/build/StructureDictionaries.js";

import {
  DecoratorImplMeta,
  PropertyName,
  PropertyValue,
  StructureImplMeta,
} from "#stage_one/build/structureMeta/DataClasses.js";

import {
  GetAccessorDeclarationImpl,
  ParameterDeclarationImpl,
  PropertyDeclarationImpl,
  SetAccessorDeclarationImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import ConstantTypeStructures from "../utilities/ConstantTypeStructures.js";
import ClassFieldStatementsMap from "../utilities/public/ClassFieldStatementsMap.js";
import ClassMembersMap from "../utilities/public/ClassMembersMap.js";

export default function addTypeStructures(
  name: string,
  meta: DecoratorImplMeta | StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  let parts: DecoratorParts | StructureParts;
  if (meta instanceof DecoratorImplMeta) {
    parts = dictionaries.decoratorParts.get(meta)!;
  } else {
    parts = dictionaries.structureParts.get(meta)!;
  }

  meta.structureFields.forEach((propertyValue, propertyKey) => {
    if (propertyValue.representsType) {
      addTypeAccessor(dictionaries, parts, propertyValue, propertyKey)
    }
  });

  return Promise.resolve();
}

function addTypeAccessor(
  dictionaries: StructureDictionaries,
  parts: DecoratorParts | StructureParts,
  propertyValue: PropertyValue,
  propertyKey: PropertyName
): void
{
  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isPackageImport: false,
    importNames: ["TypeAccessors"],
    isDefaultImport: false,
    isTypeOnly: false
  });

  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.publicExports.absolutePathToExportFile,
    isPackageImport: false,
    importNames: ["TypeStructures"],
    isDefaultImport: false,
    isTypeOnly: true
  });

  const existingProperty = parts.classMembersMap.getAsKind(propertyKey, StructureKind.Property)!;
  parts.classMembersMap.delete(propertyKey);

  const typeAccessorProp = new PropertyDeclarationImpl(`#${propertyKey}Manager`);
  typeAccessorProp.isReadonly = true;
  parts.classFieldsStatements.set(
    ClassMembersMap.keyFromMember(typeAccessorProp),
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
    [ "new TypeAccessors" ]
  );

  const typeGetAccessor = new GetAccessorDeclarationImpl(propertyKey);
  typeGetAccessor.returnTypeStructure = existingProperty.typeStructure;

  const typeSetAccessor = new SetAccessorDeclarationImpl(propertyKey);
  {
    const value = new ParameterDeclarationImpl("value");
    value.typeStructure = existingProperty.typeStructure;
    typeSetAccessor.parameters.push(value);
  }

  const typeInitializer = [ `this.${typeAccessorProp.name}.type` ];
  if (propertyValue.hasQuestionToken)
    typeInitializer.push(` ?? ""`);

  parts.classFieldsStatements.set(
    ClassMembersMap.keyFromMember(typeGetAccessor),
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
    typeInitializer
  );

  const structureGetAccessor = new GetAccessorDeclarationImpl(propertyKey + "Structure");
  structureGetAccessor.returnTypeStructure = ConstantTypeStructures.string_TypeStructures_Undefined;

  const structureSetAccessor = new SetAccessorDeclarationImpl(propertyKey + "Structure");
  {
    const value = new ParameterDeclarationImpl("value");
    value.typeStructure = ConstantTypeStructures.string_TypeStructures_Undefined;
    structureSetAccessor.parameters.push(value);
  }

  parts.classFieldsStatements.set(
    ClassMembersMap.keyFromMember(structureGetAccessor),
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
    [ `this.${typeAccessorProp.name}.typeStructure` ]
  );

  parts.classMembersMap.addMembers([
    typeAccessorProp,
    typeGetAccessor,
    typeSetAccessor,
    structureGetAccessor,
    structureSetAccessor,
  ]);
}
