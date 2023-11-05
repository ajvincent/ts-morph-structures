import {
  CodeBlockWriter,
  StructureKind,
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
  UnionTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import ConstantTypeStructures from "../utilities/ConstantTypeStructures.js";
import ClassFieldStatementsMap from "../utilities/public/ClassFieldStatementsMap.js";
import ClassMembersMap from "../utilities/public/ClassMembersMap.js";
import pairedWrite from "../utilities/pairedWrite.js";

const COPY_FIELDS_NAME = ClassMembersMap.keyFromName(
  StructureKind.Method, true, "[COPY_FIELDS]"
);

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

  meta.structureFieldArrays.forEach((propertyValue, propertyKey) => {
    if (propertyValue.representsType) {
      addTypeStructureSet(dictionaries, parts, propertyValue, propertyKey);
    }
  });

  meta.structureFields.forEach((propertyValue, propertyKey) => {
    if (propertyValue.representsType) {
      addTypeAccessor(dictionaries, parts, propertyValue, propertyKey)
    }
  });

  return Promise.resolve();
}

function addTypeStructureSet(
  dictionaries: StructureDictionaries,
  parts: DecoratorParts | StructureParts,
  propertyValue: PropertyValue,
  propertyKey: PropertyName
): void
{
  parts.importsManager.addImports({
    pathToImportedModule: dictionaries.internalExports.absolutePathToExportFile,
    isPackageImport: false,
    importNames: [
      "ReadonlyArrayProxyHandler",
      "TypeStructureSet"
    ],
    isDefaultImport: false,
    isTypeOnly: false
  });

  const existingProperty = parts.classMembersMap.getAsKind(propertyKey, StructureKind.Property)!;
  parts.classMembersMap.delete(propertyKey);

  const staticProxyHandlerProp = new PropertyDeclarationImpl(`#${propertyKey}ArrayReadonlyHandler`);
  staticProxyHandlerProp.isStatic = true;
  staticProxyHandlerProp.isReadonly = true;
  parts.classFieldsStatements.set(
    ClassMembersMap.keyFromMember(staticProxyHandlerProp),
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
    [
      `new ReadonlyArrayProxyHandler("The ${propertyKey} array is read-only.  ` +
      `Please use this.${propertyKey}Set to set strings and type structures.")`
    ]
  );

  const shadowArrayProp = new PropertyDeclarationImpl(`#${propertyKey}_ShadowArray`);
  shadowArrayProp.isReadonly = true;
  shadowArrayProp.typeStructure = ConstantTypeStructures["stringOrWriterFunction[]"];
  parts.classFieldsStatements.set(
    ClassMembersMap.keyFromMember(shadowArrayProp),
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
    ["[]"]
  );

  const proxyArrayProp = new PropertyDeclarationImpl(`#${propertyKey}ProxyArray`);
  proxyArrayProp.isReadonly = true;
  parts.classFieldsStatements.set(
    ClassMembersMap.keyFromMember(proxyArrayProp),
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
    [
      (writer: CodeBlockWriter): void => {
        writer.write("new Proxy");
        pairedWrite(
          writer, "<", ">", false, false,
          () => ConstantTypeStructures["stringOrWriterFunction[]"].writerFunction(writer)
        );
        pairedWrite(
          writer, "(", ")", false, true, () => {
            writer.writeLine(`this.${shadowArrayProp.name},`);
            writer.writeLine(`${parts.classDecl.name!}.${staticProxyHandlerProp.name}`);
          }
        );
      }
    ]
  );

  const typeGetter = new GetAccessorDeclarationImpl(propertyKey);
  typeGetter.returnTypeStructure = existingProperty.typeStructure;
  parts.classFieldsStatements.set(
    ClassMembersMap.keyFromMember(existingProperty),
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, [
      `this.${proxyArrayProp.name}`
    ]
  );

  const typeStructureSetProp = new PropertyDeclarationImpl(`${propertyKey}Set`);
  typeStructureSetProp.isReadonly = true;
  parts.classFieldsStatements.set(
    ClassMembersMap.keyFromMember(typeStructureSetProp),
    ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
    [
      `new TypeStructureSet(this.${shadowArrayProp.name})`
    ]
  );

  parts.classFieldsStatements.set(
    ClassMembersMap.keyFromMember(existingProperty),
    COPY_FIELDS_NAME,
    [
      (writer: CodeBlockWriter): void => {
        writer.write(`if (Array.isArray(source.${propertyKey})) `);
        writer.block(() => {
          writer.write(`target.${typeStructureSetProp.name}.replaceFromTypeArray(source.${propertyKey});`);
        });
        writer.write(`else if (typeof source.${propertyKey} === "function") `);
        writer.block(() => {
          writer.write(`target.${typeStructureSetProp.name}.replaceFromTypeArray([source.${propertyKey}]);`);
        });
      }
    ]
  );

  parts.classMembersMap.addMembers([
    staticProxyHandlerProp,
    shadowArrayProp,
    proxyArrayProp,
    typeGetter,
    typeStructureSetProp,
  ]);
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
  if (propertyValue.hasQuestionToken && existingProperty.typeStructure) {
    existingProperty.typeStructure = new UnionTypedStructureImpl([
      existingProperty.typeStructure,
      ConstantTypeStructures.undefined
    ]);
  }

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
  if (!propertyValue.hasQuestionToken)
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
