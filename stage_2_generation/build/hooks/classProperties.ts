// #region preamble
import assert from 'node:assert/strict'

import path from "path";

import {
  CodeBlockWriter,
  StructureKind,
  WriterFunction
} from "ts-morph";

import {
  COPY_FIELDS_NAME,
  distDir
} from "#stage_two/generation/build/constants.js";

import ConstantTypeStructures from "#stage_two/generation/build/utilities/ConstantTypeStructures.js";
import {
  ArrayTypedStructureImpl,
  LiteralTypedStructureImpl,
  ParenthesesTypedStructureImpl,
  PropertyDeclarationImpl,
  TypeStructureKind,
  TypeStructures,
  UnionTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import StructureDictionaries, {
  DecoratorParts,
  StructureParts,
} from "#stage_two/generation/build/StructureDictionaries.js";

import {
  DecoratorImplMeta,
  PropertyName,
  PropertyValue,
  StructureImplMeta,
} from "#stage_two/generation/build/structureMeta/DataClasses.js";

import {
  getStructureImplName,
} from '#utilities/source/StructureNameTransforms.js';

import ClassFieldStatementsMap from "../utilities/public/ClassFieldStatementsMap.js";

import {
  write_cloneRequiredAndOptionalArray,
  write_cloneStatementsArray,
  write_cloneStructureArray,
} from '../utilities/write_cloneArray.js';
// #endregion preamble

export default function addClassProperties(
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

  const properties: PropertyDeclarationImpl[] = [];

  meta.booleanKeys.forEach(key => {
    const prop = new PropertyDeclarationImpl(key);
    properties.push(prop);

    parts.classFieldsStatements.set(
      key, ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, ["false"]
    );
    parts.classMembersMap.addMembers([prop]);

    if (key !== "isStatic") {
      parts.classFieldsStatements.set(key, COPY_FIELDS_NAME, [
        `target.${key} = source.${key} ?? false;`
      ]);
    }
  });

  meta.structureFieldArrays.forEach((
    propertyValue: PropertyValue,
    propertyKey: PropertyName
  ): void => addStructureFieldArray(name, dictionaries, parts, propertyValue, propertyKey));

  meta.structureFields.forEach((
    propertyValue: PropertyValue,
    propertyKey: PropertyName
  ): void => addStructureField(dictionaries, parts, propertyValue, propertyKey));
  parts.classMembersMap.addMembers(properties);

  return Promise.resolve();
}

function addStructureFieldArray(
  structureName: string,
  dictionaries: StructureDictionaries,
  parts: DecoratorParts | StructureParts,
  propertyValue: PropertyValue,
  propertyKey: PropertyName
): void
{
  const signature = parts.classImplementsMap.getAsKind<StructureKind.PropertySignature>(
    propertyKey, StructureKind.PropertySignature
  )!;
  signature.isReadonly = true;

  const prop = new PropertyDeclarationImpl(propertyKey);
  prop.isReadonly = true;

  let typeStructure = getTypeStructureForValue(propertyValue, parts, dictionaries);
  if (typeStructure.kind === TypeStructureKind.Union)
    typeStructure = new ParenthesesTypedStructureImpl(typeStructure);

  prop.typeStructure = new ArrayTypedStructureImpl(typeStructure);

  // this has to come early because write_cloneStatementsArray depends on it.
  parts.classMembersMap.addMembers([prop]);

  const hasAStructure = propertyValue.otherTypes.some(
    valueInUnion => valueInUnion.structureName && dictionaries.structures.has(valueInUnion.structureName)
  );

  let statement: WriterFunction;
  if (hasAStructure) {
    if (propertyValue.otherTypes.length === 2) {
      statement = write_cloneRequiredAndOptionalArray(
        structureName, dictionaries, parts, propertyValue, propertyKey
      );
    }
    else {
      statement = write_cloneStructureArray(
        structureName, dictionaries, parts, propertyValue, propertyKey
      );
    }
  }
  else if (propertyKey === "statements") {
    statement = write_cloneStatementsArray(
      structureName, dictionaries, parts, propertyValue, propertyKey
    );
  }
  else {
    statement = (writer: CodeBlockWriter): void => {
      writer.write(`if (Array.isArray(source.${propertyKey})) `);
      writer.block(() => {
        writer.write(`target.${propertyKey}.push(...source.${propertyKey});`);
      });
      writer.write(`else if (source.${propertyKey} !== undefined)`);
      writer.block(() => {
        writer.write(`target.${propertyKey}.push(source.${propertyKey});`)
      });
    };
  }

  parts.classFieldsStatements.set(propertyKey, COPY_FIELDS_NAME, [statement]);
  parts.classFieldsStatements.set(
    propertyKey, ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, ["[]"]
  );
}

function addStructureField(
  dictionaries: StructureDictionaries,
  parts: DecoratorParts | StructureParts,
  propertyValue: PropertyValue,
  propertyKey: PropertyName
): void
{
  const prop = new PropertyDeclarationImpl(propertyKey);
  prop.hasQuestionToken = propertyValue.hasQuestionToken;

  if (prop.hasQuestionToken) {
    parts.classImplementsMap.getAsKind<StructureKind.PropertySignature>(
      propertyKey, StructureKind.PropertySignature
    )!.hasQuestionToken = true;
  }

  let typeStructure = getTypeStructureForValue(propertyValue, parts, dictionaries);
  if (typeStructure.kind === TypeStructureKind.Union)
    typeStructure = new ParenthesesTypedStructureImpl(typeStructure);

  if ((typeStructure !== ConstantTypeStructures.string) || prop.hasQuestionToken)
    prop.typeStructure = typeStructure;

  const initializer = getInitializerForValue(propertyKey, propertyValue, parts, dictionaries);
  if (initializer) {
    parts.classFieldsStatements.set(propertyKey, ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, [
      initializer
    ]);
  }

  if (propertyKey === "kind") {
    prop.isReadonly = true;
  }
  else {
    const hasAStructure = propertyValue.otherTypes.some(
      valueInUnion => valueInUnion.structureName && dictionaries.structures.has(valueInUnion.structureName)
    );
    if (hasAStructure) {
      assert(false, "structure found and needs entry in copyFields");
    }
    else {
      parts.classFieldsStatements.set(propertyKey, COPY_FIELDS_NAME, [
        `if (source.${propertyKey}) {\n  target.${propertyKey} = source.${propertyKey};\n}\n`,
      ]);
    }
  }

  parts.classMembersMap.addMembers([prop]);
}

function getTypeStructureForValue(
  value: PropertyValue,
  parts: DecoratorParts | StructureParts,
  dictionaries: StructureDictionaries,
): TypeStructures
{
  const structures = getTypeStructureArrayForValue(value, parts, dictionaries);
  if (structures.length === 1) {
    return structures[0];
  }
  return new UnionTypedStructureImpl(structures);
}

function getTypeStructureArrayForValue(
  value: PropertyValue,
  parts: DecoratorParts | StructureParts,
  dictionaries: StructureDictionaries
): TypeStructures[]
{
  const typeStructures: TypeStructures[] = [];

  if (value.mayBeString && value.mayBeWriter) {
    typeStructures.push(
      ConstantTypeStructures.stringOrWriterFunction
    );

    parts.importsManager.addImports({
      pathToImportedModule: dictionaries.publicExports.absolutePathToExportFile,
      isPackageImport: false,
      importNames: ["stringOrWriterFunction"],
      isDefaultImport: false,
      isTypeOnly: true,
    });

    dictionaries.publicExports.addExports({
      absolutePathToModule: path.join(distDir, "source/types/stringOrWriterFunction.d.ts"),
      exportNames: ["stringOrWriterFunction"],
      isDefaultExport: false,
      isType: true,
    });
  }
  else if (value.mayBeString) {
    typeStructures.push(ConstantTypeStructures.string);
  }
  else if (value.mayBeWriter) {
    typeStructures.push(ConstantTypeStructures.WriterFunction);
    parts.importsManager.addImports({
      pathToImportedModule: "ts-morph",
      isPackageImport: true,
      importNames: ["WriterFunction"],
      isDefaultImport: false,
      isTypeOnly: true
    });
  }

  if (value.mayBeUndefined) {
    typeStructures.push(ConstantTypeStructures.undefined);
  }

  value.otherTypes.forEach(valueInUnion => {
    if (valueInUnion.structureName && dictionaries.structures.has(valueInUnion.structureName)) {
      const implName = getStructureImplName(valueInUnion.structureName);
      typeStructures.push(new LiteralTypedStructureImpl(implName));

      if (implName !== parts.classDecl.name) {
        parts.importsManager.addImports({
          pathToImportedModule: dictionaries.publicExports.absolutePathToExportFile,
          isPackageImport: false,
          importNames: [implName],
          isDefaultImport: false,
          isTypeOnly: false,
        });
      }

      return;
    }

    typeStructures.push(new LiteralTypedStructureImpl(
      valueInUnion.structureName ??
      valueInUnion.unionName ??
      valueInUnion.tsmorph_Type!
    ));

    if (valueInUnion.structureName) {
      parts.importsManager.addImports({
        pathToImportedModule: "ts-morph",
        isPackageImport: true,
        importNames: [valueInUnion.structureName],
        isDefaultImport: false,
        isTypeOnly: true
      });
    }

    if (valueInUnion.unionName) {
      parts.importsManager.addImports({
        pathToImportedModule: "ts-morph",
        isPackageImport: true,
        importNames: [valueInUnion.unionName],
        isDefaultImport: false,
        isTypeOnly: true
      });
    }

    if (valueInUnion.tsmorph_Type) {
      if (valueInUnion.tsmorph_Type !== "number") {
        parts.importsManager.addImports({
          pathToImportedModule: "ts-morph",
          isPackageImport: true,
          importNames: [valueInUnion.tsmorph_Type.replace(/\..*/g, "")],
          isDefaultImport: false,
          isTypeOnly: false
        });
      }
    }
  });

  return typeStructures;
}

function getInitializerForValue(
  key: PropertyName,
  value: PropertyValue,
  parts: DecoratorParts | StructureParts,
  dictionaries: StructureDictionaries
): string | undefined
{
  if (value.mayBeUndefined || value.hasQuestionToken) {
    return "undefined";
  }

  if (value.mayBeString) {
    return `""`;
  }

  if (key === "kind") {
    return value.otherTypes[0].tsmorph_Type!;
  }

  void(parts);
  void(dictionaries);
  return undefined;
}


