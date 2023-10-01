import path from "path";
import { distDir } from "../../constants.js";

import ConstantTypeStructures from "../../utilities/ConstantTypeStructures.js";
import {
  ArrayTypedStructureImpl,
  LiteralTypedStructureImpl,
  ParenthesesTypedStructureImpl,
  PropertyDeclarationImpl,
  TypeStructureKind,
  TypeStructures,
  UnionTypedStructureImpl,
} from "../../../prototype-snapshot/exports.js";

import StructureDictionaries, { DecoratorStructureParts } from "../../StructureDictionaries.js";
import type {
  DecoratorImplMeta,
  PropertyName,
  PropertyValue,
} from "../../structureMeta/DataClasses.js";
import { WriterFunction } from "ts-morph";

export default function addClassProperties(
  name: string,
  meta: DecoratorImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts = dictionaries.decoratorParts.get(meta);
  if (!parts)
    return Promise.resolve();

  meta.booleanKeys.forEach(key => {
    const prop = new PropertyDeclarationImpl(key);
    prop.initializer = "false";

    parts.classDecl.properties.push(prop);
    parts.copyFields.statements.push(
      `target.${key} = source.${key} ?? false;`
    );
  });

  meta.structureFieldArrays.forEach((propertyValue, key) => {
    const prop = new PropertyDeclarationImpl(key);
    prop.initializer = "[]";

    let typeStructure = getTypeStructureForValue(propertyValue, parts, dictionaries);
    if (typeStructure.kind === TypeStructureKind.Union)
      typeStructure = new ParenthesesTypedStructureImpl(typeStructure);

    prop.typeStructure = new ArrayTypedStructureImpl(typeStructure);

    parts.classDecl.properties.push(prop);

    const maySlice = propertyValue.otherTypes.every(
      valueInUnion => !valueInUnion.isOptionalKind
    );
    if (maySlice) {
      const statement: WriterFunction = writer => {
        writer.write(`if (Array.isArray(source.${key})) `);
        writer.block(() => {
          writer.write(`target.${key} = source.${key}.slice();`);
        });
        writer.write(`else if (source.${key} !== undefined)`);
        writer.block(() => {
          writer.write(`target.${key} = [source.${key}];`)
        });
      };
      parts.copyFields.statements.push(statement);
    }
    else {
      console.warn(name + " mixin missing a copyFields line for " + key);
    }
  });

  meta.structureFields.forEach((propertyValue, key) => {
    const prop = new PropertyDeclarationImpl(key);
    prop.hasQuestionToken = propertyValue.hasQuestionToken;

    let typeStructure = getTypeStructureForValue(propertyValue, parts, dictionaries);
    if (typeStructure.kind === TypeStructureKind.Union)
      typeStructure = new ParenthesesTypedStructureImpl(typeStructure);

    prop.typeStructure = typeStructure;

    prop.initializer = getInitializerForValue(key, propertyValue, parts, dictionaries);

    parts.classDecl.properties.push(prop);
    parts.copyFields.statements.push(
      (writer) => {
        writer.write(`if (source.${key}) `);
        writer.block(() => writer.write(`target.${key} = source.${key};`));
      }
    );
  });

  return Promise.resolve();
}

function getTypeStructureForValue(
  value: PropertyValue,
  parts: DecoratorStructureParts,
  dictionaries: StructureDictionaries,
): TypeStructures
{
  const structures = getTypeStructureArrayForValue(value, parts, dictionaries);
  if (structures.length === 1) {
    return structures[0];
  }
  return new UnionTypedStructureImpl(structures);
}

const stringOrWriterModule = path.join(distDir, "source/types/stringOrWriter.d.ts");

function getTypeStructureArrayForValue(
  value: PropertyValue,
  parts: DecoratorStructureParts,
  dictionaries: StructureDictionaries
): TypeStructures[]
{
  const structures: TypeStructures[] = [];

  if (value.mayBeString && value.mayBeWriter) {
    structures.push(ConstantTypeStructures.stringOrWriter);

    parts.importsManager.addImports({
      pathToImportedModule: stringOrWriterModule,
      isPackageImport: false,
      importNames: ["stringOrWriter"],
      isDefaultImport: false,
      isTypeOnly: true,
    });

    dictionaries.publicExports.addExports({
      absolutePathToModule: path.join(distDir, "source/types/stringOrWriter.ts"),
      exportNames: ["stringOrWriter"],
      isDefaultExport: false,
      isType: true,
    });
  }
  else if (value.mayBeString) {
    structures.push(ConstantTypeStructures.string);
  }
  else if (value.mayBeWriter) {
    structures.push(ConstantTypeStructures.WriterFunction);
    parts.importsManager.addImports({
      pathToImportedModule: "ts-morph",
      isPackageImport: true,
      importNames: ["WriterFunction"],
      isDefaultImport: false,
      isTypeOnly: true
    });
  }

  if (value.mayBeUndefined) {
    structures.push(ConstantTypeStructures.undefined);
  }

  value.otherTypes.forEach(valueInUnion => {
    structures.push(new LiteralTypedStructureImpl(
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
      parts.importsManager.addImports({
        pathToImportedModule: "ts-morph",
        isPackageImport: true,
        importNames: [valueInUnion.tsmorph_Type],
        isDefaultImport: false,
        isTypeOnly: true
      });
    }
  });

  return structures;
}

function getInitializerForValue(
  key: PropertyName,
  value: PropertyValue,
  parts: DecoratorStructureParts,
  dictionaries: StructureDictionaries
): string | undefined
{
  if (value.mayBeUndefined || value.hasQuestionToken) {
    return "undefined";
  }

  if (value.mayBeString) {
    return `""`;
  }

  /*
  const { classDecl } = parts;
  let ctor: ConstructorDeclarationImpl;
  if (!classDecl.ctors.length) {
    ctor = new ConstructorDeclarationImpl;
    ctor.statements.push("super();");

    classDecl.ctors.push(ctor);
  } else {
    ctor = classDecl.ctors[0];
  }

  const param = new ParameterDeclarationImpl(key);
  param.typeStructure = getTypeStructureForValue(value, parts, dictionaries);

  ctor.parameters.push(param);
  ctor.statements.push(`this.${key} = ${key};`);
  */
  void(parts);
  void(dictionaries);
  return undefined;
}
